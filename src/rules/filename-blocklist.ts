/**
 * The filename should be blocklisted.
 */
import { createEslintRule } from '../utils/eslint'
import { getFilePath, getFilename } from '../utils/filename'
import { matchRule } from '../utils/rule'
import {
  globPatternValidator,
  validateNamingPatternObject,
} from '../utils/validation'
import {
  FILENAME_BLOCKLIST_ERROR_MESSAGE,
} from '../constants/message'

export const RULE_NAME = 'filename-blocklist'
export type MessageIds = ''
export type Options = [Record<string, string>]

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'layout',
    docs: {
      description: 'The filename should be blocklisted',
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

        for (const [blockListPattern, useInsteadPattern] of Object.entries(
          rules,
        )) {
          const matchResult
            = matchRule(filenameWithPath, blockListPattern)
            // TODO: remove this in next major version
            // legacy support for versions <= 2.0.0
            // file only can be specified by its filename, not by file path pattern
            // it's a legacy feature, will be removed in the future
            || matchRule(filename, blockListPattern)

          if (matchResult) {
            context.report({
              node,
              // @ts-expect-error message way instead of messageId
              message: FILENAME_BLOCKLIST_ERROR_MESSAGE(
                filename,
                blockListPattern,
                useInsteadPattern,
              ),
            })
            return
          }
        }
      },
    }
  },
})
