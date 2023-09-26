/**
 * The folder should match the naming pattern specified by the file extension
 */
import { createEslintRule } from '../utils/eslint'
import {
  getFilePath,
  getFilename,
  getFolderPath,
} from '../utils/filename'
import {
  globPatternValidator,
  validateNamingPatternObject,
} from '../utils/validation'
import { matchRule } from '../utils/rule'
import {
  FOLDER_MATCH_WITH_FEX_ERROR_MESSAGE,
} from '../constants/message'

export const RULE_NAME = 'folder-match-with-fex'
export type MessageIds = ''
export type Options = [Record<string, string>]

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'layout',
    docs: {
      description: 'The folder should match the naming pattern specified by the file extension',
      recommended: 'stylistic',
    },
    schema: [
      {
        type: 'object',
        additionalProperties: {
          type: 'string',
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
          globPatternValidator,
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
        const folderPath = getFolderPath(filenameWithPath)

        for (const [fexPattern, folderPattern] of Object.entries(rules)) {
          const matchResult = matchRule(
            filename,
            fexPattern,
            folderPath,
            folderPattern,
          )

          if (matchResult) {
            context.report({
              node,
              // @ts-expect-error message way instead of messageId
              message: FOLDER_MATCH_WITH_FEX_ERROR_MESSAGE(
                filenameWithPath,
                folderPattern,
              ),
            })
            return
          }
        }
      },
    }
  },
})
