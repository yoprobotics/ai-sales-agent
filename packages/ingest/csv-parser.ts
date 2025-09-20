import Papa from 'papaparse'
import { z } from 'zod'
import { ProspectCreateSchema } from '@ai-sales-agent/core'

export interface CSVParseOptions {
  delimiter?: string
  skipEmptyLines?: boolean
  header?: boolean
  dynamicTyping?: boolean
  preview?: number
  transform?: (value: string, field: string | number) => any
}

export interface CSVParseResult {
  data: any[]
  errors: Papa.ParseError[]
  meta: Papa.ParseMeta
  preview?: any[]
}

export interface CSVColumn {
  name: string
  type: 'string' | 'number' | 'email' | 'url' | 'phone'
  required: boolean
  samples: string[]
}

export interface CSVMapping {
  [csvColumn: string]: string // Maps to prospect field path (e.g., 'company.name')
}

/**
 * Parse CSV file content
 */
export function parseCSV(
  csvContent: string,
  options: CSVParseOptions = {}
): Promise<CSVParseResult> {
  return new Promise((resolve) => {
    const defaultOptions: Papa.ParseConfig = {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      delimiter: '',
      preview: options.preview || 0,
      transform: options.transform,
      complete: (results) => {
        resolve({
          data: results.data,
          errors: results.errors,
          meta: results.meta,
          preview: options.preview ? results.data.slice(0, options.preview) : undefined,
        })
      },
    }

    Papa.parse(csvContent, { ...defaultOptions, ...options })
  })
}

/**
 * Analyze CSV structure and suggest column types
 */
export function analyzeCSVStructure(data: any[]): CSVColumn[] {
  if (data.length === 0) return []

  const sampleSize = Math.min(data.length, 10)
  const samples = data.slice(0, sampleSize)
  const columns: CSVColumn[] = []

  // Get all unique column names
  const columnNames = new Set<string>()
  samples.forEach((row) => {
    Object.keys(row).forEach((key) => columnNames.add(key))
  })

  columnNames.forEach((columnName) => {
    const values = samples
      .map((row) => row[columnName])
      .filter((value) => value !== null && value !== undefined && value !== '')

    const column: CSVColumn = {
      name: columnName,
      type: detectColumnType(values),
      required: isColumnRequired(columnName),
      samples: values.slice(0, 3).map(String),
    }

    columns.push(column)
  })

  return columns.sort((a, b) => {
    // Sort required columns first, then by likelihood of being important
    if (a.required && !b.required) return -1
    if (!a.required && b.required) return 1
    
    const priority = getColumnPriority(a.name) - getColumnPriority(b.name)
    return priority !== 0 ? priority : a.name.localeCompare(b.name)
  })
}

/**
 * Detect column data type based on sample values
 */
function detectColumnType(values: any[]): CSVColumn['type'] {
  if (values.length === 0) return 'string'

  // Check for email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (values.some((value) => emailRegex.test(String(value)))) {
    return 'email'
  }

  // Check for URL
  const urlRegex = /^https?:\/\/.+/
  if (values.some((value) => urlRegex.test(String(value)))) {
    return 'url'
  }

  // Check for phone
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,}$/
  if (values.some((value) => phoneRegex.test(String(value)))) {
    return 'phone'
  }

  // Check for number
  if (values.every((value) => !isNaN(Number(value)))) {
    return 'number'
  }

  return 'string'
}

/**
 * Check if column should be required based on name
 */
function isColumnRequired(columnName: string): boolean {
  const requiredPatterns = [
    /email/i,
    /e.?mail/i,
    /company/i,
    /business/i,
    /organization/i,
    /firm/i,
  ]

  return requiredPatterns.some((pattern) => pattern.test(columnName))
}

/**
 * Get column priority for sorting (lower = higher priority)
 */
function getColumnPriority(columnName: string): number {
  const name = columnName.toLowerCase()

  // Highest priority
  if (name.includes('email')) return 1
  if (name.includes('company') || name.includes('business')) return 2
  
  // High priority
  if (name.includes('first') && name.includes('name')) return 3
  if (name.includes('last') && name.includes('name')) return 4
  if (name.includes('name')) return 5
  if (name.includes('title') || name.includes('position')) return 6
  
  // Medium priority
  if (name.includes('phone') || name.includes('tel')) return 7
  if (name.includes('linkedin')) return 8
  if (name.includes('website') || name.includes('url')) return 9
  if (name.includes('industry') || name.includes('sector')) return 10
  if (name.includes('location') || name.includes('city') || name.includes('country')) return 11
  
  // Lower priority
  return 20
}

/**
 * Suggest automatic mapping based on column analysis
 */
export function suggestMapping(columns: CSVColumn[]): CSVMapping {
  const mapping: CSVMapping = {}

  columns.forEach((column) => {
    const name = column.name.toLowerCase()
    
    // Email mapping
    if (column.type === 'email' || name.includes('email') || name.includes('e-mail')) {
      mapping[column.name] = 'email'
    }
    
    // Name mappings
    else if (name.includes('first') && name.includes('name')) {
      mapping[column.name] = 'firstName'
    }
    else if (name.includes('last') && name.includes('name')) {
      mapping[column.name] = 'lastName'
    }
    else if (name === 'name' || name === 'full_name' || name === 'fullname') {
      mapping[column.name] = 'firstName' // Will need to be split
    }
    
    // Company mappings
    else if (name.includes('company') || name.includes('business') || name.includes('organization')) {
      mapping[column.name] = 'company.name'
    }
    
    // Job title
    else if (name.includes('title') || name.includes('position') || name.includes('role')) {
      mapping[column.name] = 'jobTitle'
    }
    
    // Contact info
    else if (name.includes('phone') || name.includes('tel') || name.includes('mobile')) {
      mapping[column.name] = 'phone'
    }
    else if (name.includes('linkedin')) {
      mapping[column.name] = 'linkedinUrl'
    }
    else if (name.includes('website') || name.includes('url')) {
      mapping[column.name] = 'websiteUrl'
    }
    
    // Company details
    else if (name.includes('industry') || name.includes('sector')) {
      mapping[column.name] = 'company.industry'
    }
    else if (name.includes('size') || name.includes('employees')) {
      mapping[column.name] = 'company.size'
    }
    else if (name.includes('revenue') || name.includes('income')) {
      mapping[column.name] = 'company.revenue'
    }
    else if (name.includes('location') || name.includes('city') || name.includes('country')) {
      mapping[column.name] = 'company.location'
    }
    else if (name.includes('domain')) {
      mapping[column.name] = 'company.domain'
    }
    
    // Notes and description
    else if (name.includes('note') || name.includes('description') || name.includes('comment')) {
      mapping[column.name] = 'notes'
    }
  })

  return mapping
}

/**
 * Transform CSV row to prospect data using mapping
 */
export function transformRowToProspect(
  row: any,
  mapping: CSVMapping,
  icpId: string
): Partial<any> {
  const prospect: any = {
    icpId,
    source: 'csv_import',
    company: {},
    customFields: {},
  }

  Object.entries(mapping).forEach(([csvColumn, prospectField]) => {
    const value = row[csvColumn]
    if (value === undefined || value === null || value === '') return

    // Handle nested fields (e.g., 'company.name')
    if (prospectField.includes('.')) {
      const [parent, child] = prospectField.split('.')
      if (!prospect[parent]) prospect[parent] = {}
      prospect[parent][child] = value
    } else {
      prospect[prospectField] = value
    }
  })

  // Handle special cases
  if (prospect.firstName && !prospect.lastName && prospect.firstName.includes(' ')) {
    const nameParts = prospect.firstName.split(' ')
    prospect.firstName = nameParts[0]
    prospect.lastName = nameParts.slice(1).join(' ')
  }

  // Store unmapped fields in customFields
  Object.keys(row).forEach((csvColumn) => {
    if (!mapping[csvColumn] && row[csvColumn]) {
      prospect.customFields[csvColumn] = row[csvColumn]
    }
  })

  return prospect
}

/**
 * Validate transformed prospect data
 */
export function validateProspectData(
  prospect: any
): { valid: boolean; errors: string[] } {
  try {
    ProspectCreateSchema.parse(prospect)
    return { valid: true, errors: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map((err) => `${err.path.join('.')}: ${err.message}`),
      }
    }
    return { valid: false, errors: ['Validation failed'] }
  }
}

/**
 * Process entire CSV with mapping and validation
 */
export async function processCSV(
  csvContent: string,
  mapping: CSVMapping,
  icpId: string,
  options: CSVParseOptions = {}
): Promise<{
  valid: any[]
  invalid: Array<{ row: any; errors: string[]; index: number }>
  summary: {
    total: number
    valid: number
    invalid: number
    duplicates: number
  }
}> {
  const parseResult = await parseCSV(csvContent, options)
  const valid: any[] = []
  const invalid: Array<{ row: any; errors: string[]; index: number }> = []
  const seenEmails = new Set<string>()
  let duplicates = 0

  parseResult.data.forEach((row, index) => {
    const prospect = transformRowToProspect(row, mapping, icpId)
    const validation = validateProspectData(prospect)

    if (!validation.valid) {
      invalid.push({ row, errors: validation.errors, index })
      return
    }

    // Check for duplicate emails
    if (prospect.email && seenEmails.has(prospect.email.toLowerCase())) {
      duplicates++
      return
    }

    if (prospect.email) {
      seenEmails.add(prospect.email.toLowerCase())
    }

    valid.push(prospect)
  })

  return {
    valid,
    invalid,
    summary: {
      total: parseResult.data.length,
      valid: valid.length,
      invalid: invalid.length,
      duplicates,
    },
  }
}
