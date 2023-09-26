/**
 * Utils about validation
 */

import isGlob from 'is-glob'
import NAMING_CONVENTION from '../constants/naming-convention'
import { PREFINED_MATCH_SYNTAX_REGEXP } from '../constants/regex'
import {
  NAMING_PATTERN_OBJECT_ERROR_MESSAGE,
  PATTERN_ERROR_MESSAGE,
} from '../constants/message'
import { isObject } from './utility'

/**
 * Validator
 *
 * @callback validator
 * @param {string} p pattern string
 */
/**
 * @returns {string | undefined} undefined or error message
 * @param {any} config naming pattern object configured by user
 * @param {validator} keyValidator settings key validator
 * @param {validator} valueValidator settings value validator
 */
function validateNamingPatternObject(config, keyValidator, valueValidator) {
  if (!isObject(config))
    return NAMING_PATTERN_OBJECT_ERROR_MESSAGE(config)

  for (const [key, value] of Object.entries(config)) {
    if (!keyValidator(key))
      return PATTERN_ERROR_MESSAGE(key)
    else if (!valueValidator(value))
      return PATTERN_ERROR_MESSAGE(value)
  }
}

/**
 * @returns {boolean} true if pattern is a valid naming pattern
 * @param {string} namingPattern pattern string
 */
function namingPatternValidator(namingPattern) {
  const buildInPatterns = Object.keys(NAMING_CONVENTION)

  return isGlob(namingPattern) || buildInPatterns.includes(namingPattern)
}

/**
 * @returns {boolean} true if pattern is a valid filename naming pattern
 * @param {string} namingPattern pattern string
 */
function filenameNamingPatternValidator(namingPattern) {
  return (
    namingPatternValidator(namingPattern)
    || PREFINED_MATCH_SYNTAX_REGEXP.test(namingPattern)
  )
}

/**
 * @returns {boolean} true if pattern is a valid glob pattern
 * @param {string} pattern pattern string
 */
const globPatternValidator = isGlob

export {
  validateNamingPatternObject,
  namingPatternValidator,
  filenameNamingPatternValidator,
  globPatternValidator,
}
