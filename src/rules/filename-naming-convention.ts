/**
 * The filename should follow the filename naming convention
 */
import { createEslintRule } from '../utils/eslint'
import { getBasename, getFilePath, getFilename } from '../utils/filename'
import { matchRule, transformRuleWithPrefinedMatchSyntax } from '../utils/rule'
import {
  filenameNamingPatternValidator,
  globPatternValidator,
  validateNamingPatternObject,
} from '../utils/validation'
import {
  FILENAME_NAMING_CONVENTION_ERROR_MESSAGE,
} from '../constants/message'
import { toArray } from '../utils/utility'

export const RULE_NAME = 'filename-naming-convention'
export type MessageIds = ''
export type Options = [Record<string, string | string[]>, { ignoreMiddleExtensions?: boolean }] | [Record<string, string | string[]>]

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'layout',
    docs: {
      description: 'The filename should follow the filename naming convention',
      recommended: 'stylistic',
    },
    schema: [
      {
        type: 'object',
      },
      {
        type: 'object',
        properties: {
          ignoreMiddleExtensions: { type: 'boolean' },
        },
      },
    ],
    messages: {
      '': '',
    },
  },
  defaultOptions: [
    {},
  ],
  create(context) {
    return {
      Program: (node) => {
        const rules = context.options[0]
        const message = validateNamingPatternObject(
          rules,
          globPatternValidator,
          filenameNamingPatternValidator,
        )

        if (message) {
          context.report({
            node,
            // @ts-expect-error message way instead of messageId
            message,
          })
          return
        }

        const filenameWithPath = getFilePath(context)
        const filename = getFilename(filenameWithPath)
        const { ignoreMiddleExtensions } = context.options[1] || {}

        function checkRule(originalFilenamePattern: string, originalNamingPattern: string, errorCb? : (pattern: string) => void) {
          const [filenamePattern, namingPattern]
            = transformRuleWithPrefinedMatchSyntax(
              [originalFilenamePattern, originalNamingPattern],
              filenameWithPath,
            )

          const matchResult = matchRule(
            filenameWithPath,
            filenamePattern,
            getBasename(filename, ignoreMiddleExtensions),
            namingPattern,
          )

          if (matchResult) {
            errorCb && errorCb(originalNamingPattern)
          }
        }

        for (const [
          originalFilenamePattern,
          originalNamingPattern,
        ] of Object.entries(rules)) {
          const notMatchedPattern: string[] = []
          for (const namingPattern of toArray(originalNamingPattern)) {
            checkRule(originalFilenamePattern, namingPattern, (pattern) => {
              notMatchedPattern.push(pattern)
            })
          }

          // NOTE: if all naming patterns are invalid, report the error
          if (notMatchedPattern.length >= toArray(originalNamingPattern).length) {
            context.report({
              node,
              // @ts-expect-error message way instead of messageId
              message: FILENAME_NAMING_CONVENTION_ERROR_MESSAGE(
                filename,
                notMatchedPattern.join(' or ')
              ),
            })
            return
          }
        }
      },
    }
  },
})
