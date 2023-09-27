/**
 * The folder should follow the folder naming convention
 */
import micromatch from 'micromatch'
import { createEslintRule } from '../utils/eslint'
import {
  getAllFolders,
  getFilePath,
  getFolderPath,
  getSubPaths,
} from '../utils/filename'
import {
  globPatternValidator,
  namingPatternValidator,
  validateNamingPatternObject,
} from '../utils/validation'
import { isNotEmpty } from '../utils/utility'
import NAMING_CONVENTION from '../constants/naming-convention'
import {
  FOLDER_NAMING_CONVENTION_ERROR_MESSAGE,
} from '../constants/message'
import { toArray } from '../utils/utility'

export const RULE_NAME = 'folder-naming-convention'
export type MessageIds = ''
export type Options = [Record<string, string | string[]>]

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'layout',
    docs: {
      description: 'The folder should follow the folder naming convention',
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
          namingPatternValidator,
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
        const folderPath = getFolderPath(filenameWithPath)
        const subPaths = getSubPaths(folderPath)

        function checkRule(folder: string, namingPattern: string, errorCb? : (pattern: string) => void) {
          if (!micromatch.isMatch(
            folder,
            NAMING_CONVENTION[namingPattern as keyof typeof NAMING_CONVENTION] || namingPattern,
          )) {
            errorCb && errorCb(namingPattern)
          }
        }

        for (const path of subPaths) {
          for (const [folderPattern, namingPattern] of Object.entries(rules)) {
            if (!micromatch.isMatch(path, folderPattern)) {
              continue
            }
            else {
              const matchedPaths
                = micromatch.capture(folderPattern, path) || []
              const folders = matchedPaths
                .filter(isNotEmpty)
                .reduce((s, p) => s.concat(getAllFolders(p)), [])

              const notMatchedPattern = [] as string[]
              for (const folder of folders) {
                for (const _namingPattern of toArray(namingPattern)) {
                  checkRule(folder, _namingPattern, (pattern) => {
                    notMatchedPattern.push(pattern)
                  })
                }

                // NOTE: if all naming patterns are invalid, report the error
                if (notMatchedPattern.length >= toArray(namingPattern).length) {
                  context.report({
                    node,
                    // @ts-expect-error message way instead of messageId
                    message: FOLDER_NAMING_CONVENTION_ERROR_MESSAGE(
                      folder,
                      notMatchedPattern.join(' or '),
                    ),
                  })
                  return
                }
              }
            }
          }
        }
      },
    }
  },
})
