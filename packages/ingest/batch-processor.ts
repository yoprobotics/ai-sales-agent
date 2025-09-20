// Batch processor for handling large volumes of prospect data
import PQueue from 'p-queue';
import {
  ValidationError,
  AppError,
  ProspectCreateSchema,
  type ProspectCreate
} from '@ai-sales-agent/core';
import {
  parseCSV,
  type ColumnMapping,
  type CSVParseOptions,
  type ParsedProspect
} from './csv-parser';
import {
  scrapeUrl,
  scrapeUrls,
  type ScrapingOptions,
  type ScrapingResult
} from './url-scraper';
import {
  normalizeProspectData,
  type NormalizedProspectData,
  type NormalizationOptions
} from './normalizer';
import {
  deduplicateBatch,
  detectDuplicate,
  mergeDuplicates,
  type DeduplicationOptions,
  type BatchDeduplicationResult,
  DuplicateStrategy
} from './deduplicator';

// Batch processing options
export interface BatchProcessingOptions {
  concurrency?: number; // Number of parallel operations
  chunkSize?: number; // Size of each processing chunk
  timeout?: number; // Timeout per operation (ms)
  retryAttempts?: number; // Number of retry attempts
  retryDelay?: number; // Delay between retries (ms)
  skipErrors?: boolean; // Continue processing on errors
  validateData?: boolean; // Validate against schemas
  normalizeData?: boolean; // Apply normalization
  deduplicateData?: boolean; // Remove duplicates
  enrichData?: boolean; // Enrich with external data
  progressCallback?: (progress: BatchProgress) => void;
}

// Batch progress tracking
export interface BatchProgress {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  skipped: number;
  percentage: number;
  currentChunk?: number;
  totalChunks?: number;
  estimatedTimeRemaining?: number; // seconds
  errors?: Array<{ index: number; error: string }>;
}

// Batch processing result
export interface BatchProcessingResult<T = any> {
  success: boolean;
  data: T[];
  errors: Array<{
    index: number;
    data?: any;
    error: string;
  }>;
  stats: {
    total: number;
    successful: number;
    failed: number;
    skipped: number;
    duplicates?: number;
    processingTime: number; // milliseconds
  };
  duplicates?: any[];
}

// Processing pipeline stages
export enum ProcessingStage {
  PARSE = 'parse',
  NORMALIZE = 'normalize',
  VALIDATE = 'validate',
  DEDUPLICATE = 'deduplicate',
  ENRICH = 'enrich',
  TRANSFORM = 'transform',
  SAVE = 'save'
}

// Pipeline configuration
export interface PipelineConfig {
  stages: ProcessingStage[];
  options?: {
    parse?: CSVParseOptions;
    normalize?: NormalizationOptions;
    deduplicate?: DeduplicationOptions;
    scrape?: ScrapingOptions;
  };
}

// Create a processing queue
function createQueue(concurrency: number): PQueue {
  return new PQueue({ concurrency });
}

// Chunk an array into smaller pieces
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Retry a function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  attempts: number,
  delay: number
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, attempts - 1, delay * 2);
  }
}

// Process CSV file in batches
export async function processCSVBatch(
  fileContent: string | File,
  mapping: ColumnMapping,
  icpId: string,
  options: BatchProcessingOptions = {}
): Promise<BatchProcessingResult<ProspectCreate>> {
  const startTime = Date.now();
  const errors: Array<{ index: number; data?: any; error: string }> = [];
  
  try {
    // Parse CSV
    const parseResult = await parseCSV(fileContent, mapping, {
      icpId,
      maxRows: options.chunkSize,
      validateEmail: options.validateData,
      detectDuplicates: false // We'll handle this separately
    });
    
    if (!parseResult.success) {
      throw new ValidationError('CSV parsing failed');
    }
    
    let prospects = parseResult.prospects;
    const progress: BatchProgress = {
      total: prospects.length,
      processed: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      percentage: 0
    };
    
    // Report initial progress
    options.progressCallback?.(progress);
    
    // Normalize data if requested
    if (options.normalizeData !== false) {
      prospects = prospects.map(p => ({
        ...p,
        ...normalizeProspectData(p)
      }));
      progress.processed = prospects.length;
      progress.percentage = 20;
      options.progressCallback?.(progress);
    }
    
    // Deduplicate if requested
    let duplicates: any[] = [];
    if (options.deduplicateData !== false) {
      const dedupeResult = deduplicateBatch(prospects, {
        strategy: DuplicateStrategy.FUZZY,
        threshold: 0.8,
        ignoreCase: true
      });
      
      prospects = dedupeResult.unique;
      duplicates = dedupeResult.duplicates;
      progress.skipped = dedupeResult.stats.duplicates;
      progress.percentage = 40;
      options.progressCallback?.(progress);
    }
    
    // Validate data if requested
    const validated: ProspectCreate[] = [];
    if (options.validateData !== false) {
      for (let i = 0; i < prospects.length; i++) {
        try {
          const validProspect = ProspectCreateSchema.parse({
            ...prospects[i],
            icpId,
            source: 'csv_import'
          });
          validated.push(validProspect);
          progress.successful++;
        } catch (error) {
          errors.push({
            index: i,
            data: prospects[i],
            error: error instanceof Error ? error.message : 'Validation failed'
          });
          progress.failed++;
        }
        
        progress.processed++;
        progress.percentage = 40 + (60 * progress.processed / progress.total);
        
        // Report progress periodically
        if (progress.processed % 10 === 0) {
          options.progressCallback?.(progress);
        }
      }
    } else {
      // No validation, convert all
      prospects.forEach(p => {
        validated.push({
          ...p,
          icpId,
          source: 'csv_import'
        } as ProspectCreate);
      });
      progress.successful = prospects.length;
      progress.processed = prospects.length;
      progress.percentage = 100;
    }
    
    // Final progress update
    progress.percentage = 100;
    options.progressCallback?.(progress);
    
    return {
      success: errors.length === 0,
      data: validated,
      errors,
      stats: {
        total: parseResult.stats.totalRows,
        successful: validated.length,
        failed: errors.length,
        skipped: duplicates.length,
        duplicates: duplicates.length,
        processingTime: Date.now() - startTime
      },
      duplicates
    };
    
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [{
        index: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }],
      stats: {
        total: 0,
        successful: 0,
        failed: 1,
        skipped: 0,
        processingTime: Date.now() - startTime
      }
    };
  }
}

// Process URLs in batches
export async function processUrlBatch(
  urls: string[],
  icpId: string,
  options: BatchProcessingOptions = {}
): Promise<BatchProcessingResult<ProspectCreate>> {
  const startTime = Date.now();
  const queue = createQueue(options.concurrency || 3);
  const errors: Array<{ index: number; data?: any; error: string }> = [];
  const prospects: ProspectCreate[] = [];
  
  const progress: BatchProgress = {
    total: urls.length,
    processed: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    percentage: 0
  };
  
  // Create chunks for batch processing
  const chunks = chunkArray(urls, options.chunkSize || 10);
  progress.totalChunks = chunks.length;
  
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];
    progress.currentChunk = chunkIndex + 1;
    
    // Process chunk URLs in parallel
    const chunkPromises = chunk.map((url, indexInChunk) => {
      const globalIndex = chunkIndex * (options.chunkSize || 10) + indexInChunk;
      
      return queue.add(async () => {
        try {
          // Scrape URL with retry
          const scrapeResult = await retryWithBackoff(
            () => scrapeUrl(url, {
              timeout: options.timeout || 30000,
              javascript: true,
              extractEmails: true,
              extractPhones: true,
              extractSocials: true
            }),
            options.retryAttempts || 2,
            options.retryDelay || 1000
          );
          
          if (!scrapeResult.success || !scrapeResult.companyData) {
            throw new Error(scrapeResult.error || 'Failed to scrape URL');
          }
          
          // Convert scraped data to prospect
          const prospectData: any = {
            email: scrapeResult.companyData.contactEmails?.[0] || `contact@${scrapeResult.companyData.domain}`,
            company: {
              name: scrapeResult.companyData.name || 'Unknown',
              domain: scrapeResult.companyData.domain,
              industry: scrapeResult.companyData.industry,
              size: scrapeResult.companyData.size,
              location: scrapeResult.companyData.location,
              founded: scrapeResult.companyData.founded,
              technologies: scrapeResult.companyData.technologies
            },
            websiteUrl: url,
            linkedinUrl: scrapeResult.companyData.socialLinks?.linkedin,
            notes: scrapeResult.companyData.description,
            icpId,
            source: 'url_scraping'
          };
          
          // Normalize if requested
          if (options.normalizeData !== false) {
            Object.assign(prospectData, normalizeProspectData(prospectData));
          }
          
          // Validate if requested
          if (options.validateData !== false) {
            const validated = ProspectCreateSchema.parse(prospectData);
            prospects.push(validated);
          } else {
            prospects.push(prospectData as ProspectCreate);
          }
          
          progress.successful++;
        } catch (error) {
          errors.push({
            index: globalIndex,
            data: url,
            error: error instanceof Error ? error.message : 'Processing failed'
          });
          progress.failed++;
          
          if (!options.skipErrors) {
            throw error;
          }
        }
        
        progress.processed++;
        progress.percentage = Math.round((progress.processed / progress.total) * 100);
        
        // Estimate time remaining
        const elapsed = Date.now() - startTime;
        const rate = progress.processed / (elapsed / 1000);
        progress.estimatedTimeRemaining = Math.round((progress.total - progress.processed) / rate);
        
        options.progressCallback?.(progress);
      });
    });
    
    // Wait for chunk to complete
    await Promise.all(chunkPromises);
    
    // Add delay between chunks to avoid rate limiting
    if (chunkIndex < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Deduplicate if requested
  let duplicates: any[] = [];
  if (options.deduplicateData !== false && prospects.length > 0) {
    const dedupeResult = deduplicateBatch(prospects, {
      strategy: DuplicateStrategy.COMPANY,
      threshold: 0.8,
      ignoreCase: true
    });
    
    const uniqueProspects = dedupeResult.unique as ProspectCreate[];
    duplicates = dedupeResult.duplicates;
    progress.skipped = dedupeResult.stats.duplicates;
    
    // Update prospects array
    prospects.length = 0;
    prospects.push(...uniqueProspects);
  }
  
  return {
    success: errors.length === 0 || (options.skipErrors && prospects.length > 0),
    data: prospects,
    errors,
    stats: {
      total: urls.length,
      successful: prospects.length,
      failed: errors.length,
      skipped: duplicates.length,
      duplicates: duplicates.length,
      processingTime: Date.now() - startTime
    },
    duplicates
  };
}

// Generic batch processor for any data type
export async function processBatch<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  options: BatchProcessingOptions = {}
): Promise<BatchProcessingResult<R>> {
  const startTime = Date.now();
  const queue = createQueue(options.concurrency || 5);
  const results: R[] = [];
  const errors: Array<{ index: number; data?: any; error: string }> = [];
  
  const progress: BatchProgress = {
    total: items.length,
    processed: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    percentage: 0
  };
  
  // Process items
  const promises = items.map((item, index) => {
    return queue.add(async () => {
      try {
        const result = await retryWithBackoff(
          () => processor(item, index),
          options.retryAttempts || 1,
          options.retryDelay || 1000
        );
        
        results.push(result);
        progress.successful++;
      } catch (error) {
        errors.push({
          index,
          data: item,
          error: error instanceof Error ? error.message : 'Processing failed'
        });
        progress.failed++;
        
        if (!options.skipErrors) {
          throw error;
        }
      }
      
      progress.processed++;
      progress.percentage = Math.round((progress.processed / progress.total) * 100);
      options.progressCallback?.(progress);
    });
  });
  
  await Promise.all(promises);
  
  return {
    success: errors.length === 0,
    data: results,
    errors,
    stats: {
      total: items.length,
      successful: results.length,
      failed: errors.length,
      skipped: 0,
      processingTime: Date.now() - startTime
    }
  };
}

// Create a processing pipeline
export function createPipeline(config: PipelineConfig) {
  return {
    async process(data: any[], options: BatchProcessingOptions = {}): Promise<BatchProcessingResult> {
      let processedData = [...data];
      const errors: any[] = [];
      
      for (const stage of config.stages) {
        switch (stage) {
          case ProcessingStage.NORMALIZE:
            if (config.options?.normalize) {
              processedData = processedData.map(item => 
                normalizeProspectData(item, config.options!.normalize)
              );
            }
            break;
            
          case ProcessingStage.VALIDATE:
            const validated: any[] = [];
            for (const item of processedData) {
              try {
                validated.push(ProspectCreateSchema.parse(item));
              } catch (error) {
                if (!options.skipErrors) throw error;
                errors.push({ data: item, error });
              }
            }
            processedData = validated;
            break;
            
          case ProcessingStage.DEDUPLICATE:
            if (config.options?.deduplicate) {
              const result = deduplicateBatch(processedData, config.options.deduplicate);
              processedData = result.unique;
            }
            break;
            
          // Add more stages as needed
        }
      }
      
      return {
        success: errors.length === 0,
        data: processedData,
        errors,
        stats: {
          total: data.length,
          successful: processedData.length,
          failed: errors.length,
          skipped: data.length - processedData.length,
          processingTime: 0
        }
      };
    }
  };
}

// Export all batch processing utilities
export {
  createQueue,
  chunkArray,
  retryWithBackoff
};
