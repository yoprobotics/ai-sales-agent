/**
 * Slugify a string
 * @param text The text to slugify
 * @returns Slugified string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Capitalize the first letter of a string
 * @param text The text to capitalize
 * @returns Capitalized string
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Truncate a string to a specified length
 * @param text The text to truncate
 * @param length The maximum length
 * @param suffix The suffix to add (default: '...')
 * @returns Truncated string
 */
export function truncate(text: string, length: number, suffix: string = '...'): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + suffix
}

/**
 * Extract initials from a name
 * @param firstName First name
 * @param lastName Last name
 * @returns Initials
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}