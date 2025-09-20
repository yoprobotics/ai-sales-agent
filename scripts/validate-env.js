#!/usr/bin/env node

/**
 * Script de validation de l'environnement
 * Vérifie que toutes les variables requises sont présentes et valides
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Variables d'environnement requises
const REQUIRED_ENV_VARS = {
  // Base de données
  DATABASE_URL: {
    required: true,
    validate: (value) => {
      if (!value.startsWith('postgresql://') && !value.startsWith('postgres://')) {
        return 'DATABASE_URL must be a valid PostgreSQL connection string';
      }
      return true;
    },
  },
  
  // JWT
  JWT_SECRET: {
    required: true,
    validate: (value) => {
      if (value.length < 32) {
        return 'JWT_SECRET must be at least 32 characters long';
      }
      return true;
    },
  },
  
  JWT_REFRESH_SECRET: {
    required: false,
    default: () => crypto.randomBytes(32).toString('hex'),
    validate: (value) => {
      if (value && value.length < 32) {
        return 'JWT_REFRESH_SECRET must be at least 32 characters long';
      }
      return true;
    },
  },
  
  // Encryption
  ENCRYPTION_KEY: {
    required: true,
    validate: (value) => {
      if (value.length !== 32) {
        return 'ENCRYPTION_KEY must be exactly 32 characters long';
      }
      
      // Vérifier l'entropie
      const uniqueChars = new Set(value.split('')).size;
      if (uniqueChars < 16) {
        return 'ENCRYPTION_KEY has low entropy. Use a more random key';
      }
      
      return true;
    },
    generate: () => crypto.randomBytes(16).toString('hex'),
  },
  
  // Stripe
  STRIPE_SECRET_KEY: {
    required: true,
    validate: (value) => {
      if (!value.startsWith('sk_')) {
        return 'STRIPE_SECRET_KEY must start with sk_';
      }
      if (process.env.NODE_ENV === 'production' && !value.startsWith('sk_live_')) {
        return 'STRIPE_SECRET_KEY must be a live key in production';
      }
      return true;
    },
  },
  
  STRIPE_PUBLISHABLE_KEY: {
    required: true,
    validate: (value) => {
      if (!value.startsWith('pk_')) {
        return 'STRIPE_PUBLISHABLE_KEY must start with pk_';
      }
      return true;
    },
  },
  
  STRIPE_WEBHOOK_SECRET: {
    required: true,
    validate: (value) => {
      if (!value.startsWith('whsec_')) {
        return 'STRIPE_WEBHOOK_SECRET must start with whsec_';
      }
      return true;
    },
  },
  
  // SendGrid
  SENDGRID_API_KEY: {
    required: true,
    validate: (value) => {
      if (!value.startsWith('SG.')) {
        return 'SENDGRID_API_KEY must start with SG.';
      }
      return true;
    },
  },
  
  SENDGRID_FROM_EMAIL: {
    required: true,
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'SENDGRID_FROM_EMAIL must be a valid email address';
      }
      return true;
    },
  },
  
  // OpenAI
  OPENAI_API_KEY: {
    required: true,
    validate: (value) => {
      if (!value.startsWith('sk-')) {
        return 'OPENAI_API_KEY must start with sk-';
      }
      return true;
    },
  },
  
  // Application
  APP_BASE_URL: {
    required: true,
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return 'APP_BASE_URL must be a valid URL';
      }
    },
    default: () => process.env.NODE_ENV === 'production' 
      ? 'https://app.aisalesagent.com' 
      : 'http://localhost:3000',
  },
  
  NODE_ENV: {
    required: false,
    default: () => 'development',
    validate: (value) => {
      const validEnvs = ['development', 'test', 'staging', 'production'];
      if (!validEnvs.includes(value)) {
        return `NODE_ENV must be one of: ${validEnvs.join(', ')}`;
      }
      return true;
    },
  },
  
  // Optionnel
  MONITORING_ENDPOINT: {
    required: false,
    validate: (value) => {
      if (value) {
        try {
          new URL(value);
        } catch {
          return 'MONITORING_ENDPOINT must be a valid URL';
        }
      }
      return true;
    },
  },
};

// Couleurs pour le terminal
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

// Fonction pour valider l'environnement
function validateEnvironment() {
  console.log(`${colors.blue}🔍 Validating environment variables...${colors.reset}\n`);
  
  const errors = [];
  const warnings = [];
  const missing = [];
  
  // Charger le .env.local si disponible
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`${colors.green}✓ Loaded .env.local${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠ No .env.local found, using system environment${colors.reset}`);
  }
  
  // Valider chaque variable
  for (const [key, config] of Object.entries(REQUIRED_ENV_VARS)) {
    const value = process.env[key];
    
    // Vérifier la présence
    if (!value && config.required) {
      if (config.default) {
        const defaultValue = typeof config.default === 'function' 
          ? config.default() 
          : config.default;
        process.env[key] = defaultValue;
        warnings.push(`${key}: Using default value`);
      } else if (config.generate) {
        const generatedValue = config.generate();
        missing.push(`${key}=${generatedValue}`);
        errors.push(`${key}: Missing (generated suggestion above)`);
      } else {
        missing.push(`${key}=`);
        errors.push(`${key}: Required but not set`);
      }
      continue;
    }
    
    // Valider la valeur
    if (value && config.validate) {
      const result = config.validate(value);
      if (result !== true) {
        errors.push(`${key}: ${result}`);
      } else {
        console.log(`${colors.green}✓ ${key}: Valid${colors.reset}`);
      }
    }
  }
  
  // Vérifications supplémentaires
  if (process.env.NODE_ENV === 'production') {
    // Vérifier que les clés de production sont utilisées
    if (process.env.STRIPE_SECRET_KEY?.includes('test')) {
      warnings.push('Using test Stripe keys in production environment');
    }
    
    // Vérifier HTTPS
    if (!process.env.APP_BASE_URL?.startsWith('https://')) {
      errors.push('APP_BASE_URL must use HTTPS in production');
    }
  }
  
  // Afficher les résultats
  console.log('\n' + '='.repeat(60) + '\n');
  
  if (warnings.length > 0) {
    console.log(`${colors.yellow}⚠ Warnings:${colors.reset}`);
    warnings.forEach(w => console.log(`  - ${w}`));
    console.log();
  }
  
  if (errors.length > 0) {
    console.log(`${colors.red}❌ Errors:${colors.reset}`);
    errors.forEach(e => console.log(`  - ${e}`));
    console.log();
  }
  
  if (missing.length > 0) {
    console.log(`${colors.yellow}📝 Add these to your .env.local:${colors.reset}`);
    console.log('```');
    missing.forEach(m => console.log(m));
    console.log('```');
    console.log();
  }
  
  if (errors.length === 0) {
    console.log(`${colors.green}✅ All environment variables are valid!${colors.reset}`);
    
    // Créer un fichier .env.validated pour indiquer la validation
    fs.writeFileSync('.env.validated', new Date().toISOString());
    
    return true;
  } else {
    console.log(`${colors.red}❌ Environment validation failed!${colors.reset}`);
    console.log(`${colors.yellow}Fix the errors above before running the application.${colors.reset}`);
    
    // Option pour générer un template
    if (missing.length > 0) {
      console.log(`\n${colors.blue}💡 Tip: Run 'npm run env:generate' to create a template .env.local file${colors.reset}`);
    }
    
    return false;
  }
}

// Fonction pour générer un fichier .env.local template
function generateEnvTemplate() {
  const template = [];
  
  template.push('# AI Sales Agent Environment Configuration');
  template.push(`# Generated on ${new Date().toISOString()}`);
  template.push('# Fill in all values before running the application\n');
  
  // Grouper par catégorie
  const categories = {
    'Database': ['DATABASE_URL'],
    'Authentication': ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'ENCRYPTION_KEY'],
    'Stripe': ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOK_SECRET'],
    'SendGrid': ['SENDGRID_API_KEY', 'SENDGRID_FROM_EMAIL'],
    'OpenAI': ['OPENAI_API_KEY'],
    'Application': ['APP_BASE_URL', 'NODE_ENV'],
    'Monitoring (Optional)': ['MONITORING_ENDPOINT', 'MONITORING_API_KEY'],
  };
  
  for (const [category, keys] of Object.entries(categories)) {
    template.push(`# ${category}`);
    
    for (const key of keys) {
      const config = REQUIRED_ENV_VARS[key];
      if (!config && !['MONITORING_API_KEY'].includes(key)) continue;
      
      // Générer une valeur d'exemple
      let exampleValue = '';
      if (config?.generate) {
        exampleValue = config.generate();
      } else if (config?.default) {
        exampleValue = typeof config.default === 'function' 
          ? config.default() 
          : config.default;
      } else {
        // Valeurs d'exemple par défaut
        switch (key) {
          case 'DATABASE_URL':
            exampleValue = 'postgresql://username:password@localhost:5432/ai_sales_agent';
            break;
          case 'STRIPE_SECRET_KEY':
            exampleValue = 'sk_test_...';
            break;
          case 'STRIPE_PUBLISHABLE_KEY':
            exampleValue = 'pk_test_...';
            break;
          case 'STRIPE_WEBHOOK_SECRET':
            exampleValue = 'whsec_...';
            break;
          case 'SENDGRID_API_KEY':
            exampleValue = 'SG....';
            break;
          case 'SENDGRID_FROM_EMAIL':
            exampleValue = 'noreply@yourdomain.com';
            break;
          case 'OPENAI_API_KEY':
            exampleValue = 'sk-...';
            break;
          default:
            exampleValue = '';
        }
      }
      
      template.push(`${key}=${exampleValue}`);
    }
    
    template.push('');
  }
  
  // Écrire le fichier
  const outputPath = '.env.local.template';
  fs.writeFileSync(outputPath, template.join('\n'));
  
  console.log(`${colors.green}✅ Template created: ${outputPath}${colors.reset}`);
  console.log(`${colors.blue}Copy to .env.local and fill in your values:${colors.reset}`);
  console.log(`  cp ${outputPath} .env.local`);
}

// Script principal
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'generate') {
    generateEnvTemplate();
  } else {
    const isValid = validateEnvironment();
    process.exit(isValid ? 0 : 1);
  }
}

module.exports = {
  validateEnvironment,
  generateEnvTemplate,
};
