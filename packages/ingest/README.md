# @ai-sales-agent/ingest

## 📥 Data Ingestion Package

Comprehensive data ingestion package for the AI Sales Agent platform. Handles CSV parsing, URL scraping, data normalization, deduplication, and batch processing of prospect data.

## ✨ Features

- **Intelligent CSV Parsing**: Auto-detects columns and suggests mapping
- **Web Scraping**: Extracts company and contact data from websites
- **Data Normalization**: Standardizes names, emails, phones, and company data
- **Duplicate Detection**: Multiple strategies for finding and merging duplicates
- **Batch Processing**: Efficient handling of large datasets with progress tracking

## 📦 Installation

```bash
npm install @ai-sales-agent/ingest
```

## 🚀 Usage

### CSV Parsing

```typescript
import { parseCSV, suggestColumnMapping, validateProspects } from '@ai-sales-agent/ingest';

// Suggest column mapping from CSV headers
const suggestedMapping = await suggestColumnMapping(fileContent);

// Parse CSV with mapping
const result = await parseCSV(fileContent, {
  email: 'Email Address',
  firstName: 'First Name',
  lastName: 'Last Name',
  companyName: 'Company',
  jobTitle: 'Title'
}, {
  icpId: 'uuid-here',
  validateEmail: true,
  detectDuplicates: true
});

// Validate prospects against schema
const validProspects = validateProspects(result.prospects, icpId);
```

### URL Scraping

```typescript
import { scrapeUrl, scrapeUrls } from '@ai-sales-agent/ingest';

// Scrape single URL
const result = await scrapeUrl('https://example.com', {
  javascript: true, // Use Puppeteer for JS-heavy sites
  extractEmails: true,
  extractPhones: true,
  extractSocials: true
});

// Scrape multiple URLs with concurrency control
const results = await scrapeUrls(urls, {
  concurrency: 3,
  maxRetries: 2
});
```

### Data Normalization

```typescript
import { 
  normalizeProspectData,
  normalizeEmail,
  normalizeName,
  normalizeCompanyName,
  normalizePhoneNumber
} from '@ai-sales-agent/ingest';

// Normalize complete prospect data
const normalized = normalizeProspectData(rawData, {
  trimWhitespace: true,
  capitalizeNames: true,
  standardizePhones: true,
  cleanUrls: true
});

// Individual normalizers
const email = normalizeEmail('JOHN.DOE@EXAMPLE.COM'); // john.doe@example.com
const name = normalizeName('JOHN DOE'); // John Doe
const company = normalizeCompanyName('acme corp'); // Acme Corp.
const phone = normalizePhoneNumber('1234567890', { defaultCountryCode: '+1' }); // +1 (123) 456-7890
```

### Duplicate Detection

```typescript
import { 
  detectDuplicate,
  deduplicateBatch,
  mergeDuplicates,
  DuplicateStrategy
} from '@ai-sales-agent/ingest';

// Detect duplicate between two prospects
const result = detectDuplicate(prospect1, prospect2, {
  strategy: DuplicateStrategy.FUZZY,
  threshold: 0.8,
  ignoreCase: true
});

// Deduplicate batch of prospects
const dedupeResult = deduplicateBatch(prospects, {
  strategy: DuplicateStrategy.COMPANY,
  threshold: 0.75
});

// Merge duplicate records
const merged = mergeDuplicates([duplicate1, duplicate2]);
```

### Batch Processing

```typescript
import { 
  processCSVBatch,
  processUrlBatch,
  processBatch
} from '@ai-sales-agent/ingest';

// Process CSV in batches with progress tracking
const result = await processCSVBatch(fileContent, mapping, icpId, {
  chunkSize: 100,
  concurrency: 5,
  normalizeData: true,
  deduplicateData: true,
  validateData: true,
  progressCallback: (progress) => {
    console.log(`Processed: ${progress.processed}/${progress.total} (${progress.percentage}%)`);
  }
});

// Process URLs in batches
const urlResult = await processUrlBatch(urls, icpId, {
  concurrency: 3,
  retryAttempts: 2,
  skipErrors: true
});

// Generic batch processor
const processed = await processBatch(items, async (item, index) => {
  // Process each item
  return await processItem(item);
}, {
  concurrency: 10,
  retryAttempts: 3
});
```

## 🔧 API Reference

### CSV Parser

#### `suggestColumnMapping(fileContent: string | File): Promise<Partial<ColumnMapping>>`
Analyzes CSV headers and suggests column mapping.

#### `parseCSV(fileContent: string | File, mapping: ColumnMapping, options?: CSVParseOptions): Promise<CSVParseResult>`
Parses CSV file with provided column mapping.

#### `validateProspects(prospects: ParsedProspect[], icpId: string): ProspectCreate[]`
Validates prospects against the schema.

### URL Scraper

#### `scrapeUrl(url: string, options?: ScrapingOptions): Promise<ScrapingResult>`
Scrapes a single URL for company/contact data.

#### `scrapeUrls(urls: string[], options?: ScrapingOptions): Promise<ScrapingResult[]>`
Scrapes multiple URLs with concurrency control.

### Normalizer

#### `normalizeProspectData(data: any, options?: NormalizationOptions): NormalizedProspectData`
Normalizes all prospect fields.

#### Individual normalizers for specific fields
- `normalizeEmail(email: string, options?: NormalizationOptions): string`
- `normalizeName(name: string, options?: NormalizationOptions): string`
- `normalizeCompanyName(name: string, options?: NormalizationOptions): string`
- `normalizePhoneNumber(phone: string, options?: NormalizationOptions): string`
- `normalizeUrl(url: string, options?: NormalizationOptions): string`
- `normalizeIndustry(industry: string): string`
- `normalizeCompanySize(size: string): string`

### Deduplicator

#### `detectDuplicate(prospect1: any, prospect2: any, options?: DeduplicationOptions): DuplicateResult`
Detects if two prospects are duplicates.

#### `deduplicateBatch(prospects: any[], options?: DeduplicationOptions): BatchDeduplicationResult`
Removes duplicates from a batch of prospects.

#### `mergeDuplicates(duplicates: any[]): any`
Merges multiple duplicate records into one.

### Batch Processor

#### `processCSVBatch(fileContent: string | File, mapping: ColumnMapping, icpId: string, options?: BatchProcessingOptions): Promise<BatchProcessingResult<ProspectCreate>>`
Processes CSV file in batches with full pipeline.

#### `processUrlBatch(urls: string[], icpId: string, options?: BatchProcessingOptions): Promise<BatchProcessingResult<ProspectCreate>>`
Processes URLs in batches with scraping.

#### `processBatch<T, R>(items: T[], processor: (item: T, index: number) => Promise<R>, options?: BatchProcessingOptions): Promise<BatchProcessingResult<R>>`
Generic batch processor for any data type.

## 🎯 Duplicate Detection Strategies

- **EXACT**: Exact email match
- **DOMAIN**: Same email domain + similar name
- **FUZZY**: Fuzzy matching on multiple fields
- **COMPANY**: Same company + similar name/role
- **STRICT**: Multiple fields must match exactly

## 🔄 Processing Pipeline

The package supports a configurable processing pipeline:

1. **Parse**: Extract data from source
2. **Normalize**: Clean and standardize data
3. **Validate**: Check against schemas
4. **Deduplicate**: Remove duplicate entries
5. **Enrich**: Add external data (optional)
6. **Transform**: Apply custom transformations
7. **Save**: Prepare for database storage

## 📊 Column Mapping Intelligence

The CSV parser includes intelligent column detection that recognizes common patterns:

- Email variations: `email`, `mail`, `contact`, `e-mail`
- Name fields: `first name`, `last name`, `full name`, `nom`, `prenom`
- Company: `company`, `organization`, `entreprise`, `firm`
- Job titles: `title`, `position`, `role`, `fonction`
- And many more...

## 🌍 Internationalization

Supports French and English field names and normalizes data appropriately:
- French name patterns (accents, special characters)
- International phone formats
- Multi-language industry classifications

## ⚡ Performance

- Concurrent processing with configurable limits
- Chunked batch processing for large datasets
- Progress tracking and time estimation
- Retry logic with exponential backoff
- Memory-efficient streaming for large files

## 🛡️ Error Handling

- Comprehensive error reporting with context
- Skip errors option for batch processing
- Validation errors with detailed field information
- Retry mechanisms for transient failures

## 📝 License

Proprietary - All rights reserved

## 👥 Contributors

- YoProbotics Team

## 🐛 Bug Reports

Please report issues to the main repository: [yoprobotics/ai-sales-agent](https://github.com/yoprobotics/ai-sales-agent/issues)
