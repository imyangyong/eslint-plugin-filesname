/**
 * Regex pattern constants
 */

/**
 * @example <1>
 */
const PREFINED_MATCH_SYNTAX_REGEXP = /^<(\d+)>$/

/**
 * @example C:\
 */
const WINDOWS_DRIVE_LETTER_REGEXP = /^[A-Za-z]:\\/

/**
 * @example $0
 */
const TEMPLATE_VARIABLE_REGEXP = /\$(\d*)/

export {
  PREFINED_MATCH_SYNTAX_REGEXP,
  WINDOWS_DRIVE_LETTER_REGEXP,
  TEMPLATE_VARIABLE_REGEXP,
}
