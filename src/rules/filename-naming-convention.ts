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

export const RULE_NAME = 'filename-naming-convention'
export type MessageIds = ''
export type Options = [Record<string, string>, { ignoreMiddleExtensions?: boolean }] | [Record<string, string>]

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
        additionalProperties: {
          type: 'string',
        },
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

        for (const [
          originalFilenamePattern,
          originalNamingPattern,
        ] of Object.entries(rules)) {
          try {
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
              throw new Error(
                FILENAME_NAMING_CONVENTION_ERROR_MESSAGE(
                  filename,
                  originalNamingPattern,
                ),
              )
            }
          }
          catch (error) {
            context.report({
              node,
              // @ts-expect-error message way instead of messageId
              message: error.message,
            })
          }
        }
      },
    }
  },
})
