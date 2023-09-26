/**
 * Message templates
 */

import { template } from '../utils/utility'

const NAMING_PATTERN_OBJECT_ERROR_MESSAGE = template(
  'The naming pattern object "$0" does not appear to be an Object type, please double-check it and try again',
)

const PATTERN_ERROR_MESSAGE = template(
  'There is an invalid pattern "$0", please double-check it and try again',
)

const PREFINED_MATCH_SYNTAX_ERROR_MESSAGE = template(
  'The prefined match "$0" is not found in the pattern "$1", please double-check it and try again',
)

const FILENAME_BLOCKLIST_ERROR_MESSAGE = template(
  'The filename "$0" matches the blocklisted "$1" pattern, use a pattern like "$2" instead',
)

const FILENAME_NAMING_CONVENTION_ERROR_MESSAGE = template(
  'The filename "$0" does not match the "$1" pattern',
)

const FOLDER_MATCH_WITH_FEX_ERROR_MESSAGE = template(
  'The folder of the file "$0" does not match the "$1" pattern',
)

const FOLDER_NAMING_CONVENTION_ERROR_MESSAGE = template(
  'The folder "$0" does not match the "$1" pattern',
)

const NO_INDEX_ERROR_MESSAGE = 'The filename "index" is not allowed'

export {
  NAMING_PATTERN_OBJECT_ERROR_MESSAGE,
  PATTERN_ERROR_MESSAGE,
  PREFINED_MATCH_SYNTAX_ERROR_MESSAGE,
  FILENAME_BLOCKLIST_ERROR_MESSAGE,
  FILENAME_NAMING_CONVENTION_ERROR_MESSAGE,
  FOLDER_MATCH_WITH_FEX_ERROR_MESSAGE,
  FOLDER_NAMING_CONVENTION_ERROR_MESSAGE,
  NO_INDEX_ERROR_MESSAGE,
}
