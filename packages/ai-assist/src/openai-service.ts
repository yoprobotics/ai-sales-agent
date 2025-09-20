import { OpenAI } from 'openai';
import pRetry from 'p-retry';
import PQueue from 'p-queue';
import { z } from 'zod';

// Types et interfaces
export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  maxRetries?: number;
  timeout?: number;
  rateLimit?: {
    interval: number;
    intervalCap: number;
  };
}

export interface OpenAIMetrics {
  requestId: string;
  startTime: number;
  endTime?: number;
  latencyMs?: number;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  estimatedCost?: number;
  error?: string;
  retryCount?: number;
}

export interface SanitizedData {
  original: any;
  sanitized: any;
  removedFields: string[];
}

// Configuration par défaut
const DEFAULT_CONFIG: Partial<OpenAIConfig> = {
  model: 'gpt-4-turbo-preview',
  maxTokens: 4000,
  temperature: 0.7,
  maxRetries: 3,
  timeout: 60000,
  rateLimit: {
    interval: 60000, // 1 minute
    intervalCap: 50   // 50 requêtes par minute
  }
};

// Coûts approximatifs par 1K tokens (à mettre à jour selon les tarifs OpenAI)
const TOKEN_COSTS = {
  'gpt-4': { prompt: 0.03, completion: 0.06 },
  'gpt-4-turbo-preview': { prompt: 0.01, completion: 0.03 },
  'gpt-3.5-turbo': { prompt: 0.001, completion: 0.002 },
} as const;

// Champs PII à masquer
const PII_FIELDS = [
  'email',
  'phone',
  'phoneNumber',
  'ssn',
  'socialSecurityNumber',
  'creditCard',
  'cardNumber',
  'bankAccount',
  'iban',
  'passport',
  'driverLicense',
  'dateOfBirth',
  'dob',
  'address',
  'ipAddress',
  'password',
  'pin',
  'cvv',
];

export class OpenAIService {
  private client: OpenAI;
  private config: OpenAIConfig;
  private queue: PQueue;
  private metricsLog: OpenAIMetrics[] = [];

  constructor(config: OpenAIConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    // Initialiser le client OpenAI
    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      timeout: this.config.timeout,
    });

    // Initialiser la queue de rate limiting
    this.queue = new PQueue({
      interval: this.config.rateLimit?.interval || 60000,
      intervalCap: this.config.rateLimit?.intervalCap || 50,
      concurrency: 5, // Max 5 requêtes simultanées
    });
  }

  /**
   * Masque les données sensibles avant envoi à OpenAI
   */
  public sanitizeData(data: any): SanitizedData {
    const removedFields: string[] = [];
    
    const sanitize = (obj: any, path: string = ''): any => {
      if (!obj || typeof obj !== 'object') return obj;
      
      if (Array.isArray(obj)) {
        return obj.map((item, idx) => sanitize(item, `${path}[${idx}]`));
      }
      
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        const lowerKey = key.toLowerCase();
        
        // Vérifier si c'est un champ PII
        if (PII_FIELDS.some(pii => lowerKey.includes(pii))) {
          sanitized[key] = '[REDACTED]';
          removedFields.push(currentPath);
        } else if (typeof value === 'string') {
          // Masquer les emails
          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            sanitized[key] = '[EMAIL_REDACTED]';
            removedFields.push(currentPath);
          }
          // Masquer les numéros de téléphone
          else if (/^\+?[\d\s\-\(\)]+$/.test(value) && value.length > 9) {
            sanitized[key] = '[PHONE_REDACTED]';
            removedFields.push(currentPath);
          }
          // Masquer les URLs avec tokens/clés
          else if (value.includes('api_key=') || value.includes('token=') || value.includes('secret=')) {
            sanitized[key] = value.replace(/([?&])(api_key|token|secret)=([^&]+)/gi, '$1$2=[REDACTED]');
            removedFields.push(`${currentPath} (partial)`);
          } else {
            sanitized[key] = value;
          }
        } else if (typeof value === 'object') {
          sanitized[key] = sanitize(value, currentPath);
        } else {
          sanitized[key] = value;
        }
      }
      
      return sanitized;
    };
    
    const sanitized = sanitize(data);
    
    return {
      original: data,
      sanitized,
      removedFields
    };
  }

  /**
   * Créer une métrique pour le logging
   */
  private createMetric(model: string): OpenAIMetrics {
    return {
      requestId: `openai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: Date.now(),
      model
    };
  }

  /**
   * Calculer le coût estimé
   */
  private calculateCost(model: string, promptTokens: number, completionTokens: number): number {
    const modelKey = Object.keys(TOKEN_COSTS).find(key => model.includes(key)) as keyof typeof TOKEN_COSTS;
    if (!modelKey) return 0;
    
    const costs = TOKEN_COSTS[modelKey];
    return (promptTokens * costs.prompt / 1000) + (completionTokens * costs.completion / 1000);
  }

  /**
   * Finaliser et logger une métrique
   */
  private finalizeMetric(metric: OpenAIMetrics, usage?: any, error?: Error): void {
    metric.endTime = Date.now();
    metric.latencyMs = metric.endTime - metric.startTime;
    
    if (usage) {
      metric.promptTokens = usage.prompt_tokens;
      metric.completionTokens = usage.completion_tokens;
      metric.totalTokens = usage.total_tokens;
      metric.estimatedCost = this.calculateCost(
        metric.model,
        usage.prompt_tokens || 0,
        usage.completion_tokens || 0
      );
    }
    
    if (error) {
      metric.error = error.message;
    }
    
    // Ajouter au log interne
    this.metricsLog.push(metric);
    
    // Logger en JSON structuré
    console.log(JSON.stringify({
      type: 'openai_request',
      ...metric
    }));
  }

  /**
   * Appel générique à OpenAI avec retry et gestion d'erreurs
   */
  async completion(params: {
    messages: any[];
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
    sanitizeInput?: boolean;
    metadata?: Record<string, any>;
  }): Promise<{ content: string; usage: any; metrics: OpenAIMetrics }> {
    const model = params.model || this.config.model || 'gpt-4-turbo-preview';
    const metric = this.createMetric(model);
    
    try {
      // Sanitizer les données si demandé
      let messages = params.messages;
      if (params.sanitizeInput !== false) {
        const sanitized = this.sanitizeData(messages);
        messages = sanitized.sanitized;
        
        if (sanitized.removedFields.length > 0) {
          console.log(JSON.stringify({
            type: 'pii_sanitization',
            requestId: metric.requestId,
            removedFields: sanitized.removedFields
          }));
        }
      }
      
      // Ajouter le system prompt si fourni
      if (params.systemPrompt) {
        messages = [
          { role: 'system', content: params.systemPrompt },
          ...messages
        ];
      }
      
      // Exécuter avec retry et rate limiting
      const result = await this.queue.add(() => 
        pRetry(
          async () => {
            const response = await this.client.chat.completions.create({
              model,
              messages,
              temperature: params.temperature ?? this.config.temperature,
              max_tokens: params.maxTokens ?? this.config.maxTokens,
            });
            
            return response;
          },
          {
            retries: this.config.maxRetries || 3,
            onFailedAttempt: (error) => {
              metric.retryCount = (metric.retryCount || 0) + 1;
              console.error(JSON.stringify({
                type: 'openai_retry',
                requestId: metric.requestId,
                attempt: error.attemptNumber,
                error: error.message
              }));
              
              // Backoff exponentiel pour les erreurs de rate limit
              if (error.message.includes('429') || error.message.includes('rate')) {
                const delay = Math.min(1000 * Math.pow(2, error.attemptNumber), 30000);
                return new Promise(resolve => setTimeout(resolve, delay));
              }
            },
            minTimeout: 1000,
            maxTimeout: 30000,
            factor: 2,
          }
        )
      );
      
      // Finaliser les métriques
      this.finalizeMetric(metric, result?.usage);
      
      return {
        content: result?.choices[0]?.message?.content || '',
        usage: result?.usage,
        metrics: metric
      };
      
    } catch (error) {
      this.finalizeMetric(metric, undefined, error as Error);
      
      // Re-throw avec contexte
      throw new Error(`OpenAI API error: ${(error as Error).message} [requestId: ${metric.requestId}]`);
    }
  }

  /**
   * Obtenir les métriques agrégées
   */
  getMetrics(since?: Date): {
    totalRequests: number;
    totalTokens: number;
    totalCost: number;
    averageLatency: number;
    errorRate: number;
    byModel: Record<string, any>;
  } {
    const cutoff = since ? since.getTime() : 0;
    const relevantMetrics = this.metricsLog.filter(m => m.startTime >= cutoff);
    
    const byModel: Record<string, any> = {};
    
    let totalTokens = 0;
    let totalCost = 0;
    let totalLatency = 0;
    let errorCount = 0;
    
    for (const metric of relevantMetrics) {
      totalTokens += metric.totalTokens || 0;
      totalCost += metric.estimatedCost || 0;
      totalLatency += metric.latencyMs || 0;
      if (metric.error) errorCount++;
      
      if (!byModel[metric.model]) {
        byModel[metric.model] = {
          requests: 0,
          tokens: 0,
          cost: 0,
          errors: 0
        };
      }
      
      byModel[metric.model].requests++;
      byModel[metric.model].tokens += metric.totalTokens || 0;
      byModel[metric.model].cost += metric.estimatedCost || 0;
      if (metric.error) byModel[metric.model].errors++;
    }
    
    return {
      totalRequests: relevantMetrics.length,
      totalTokens,
      totalCost: Math.round(totalCost * 100) / 100,
      averageLatency: relevantMetrics.length ? Math.round(totalLatency / relevantMetrics.length) : 0,
      errorRate: relevantMetrics.length ? Math.round((errorCount / relevantMetrics.length) * 100) : 0,
      byModel
    };
  }

  /**
   * Nettoyer les métriques anciennes
   */
  cleanMetrics(olderThan: Date): void {
    const cutoff = olderThan.getTime();
    this.metricsLog = this.metricsLog.filter(m => m.startTime >= cutoff);
  }
}
