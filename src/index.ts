// fork from: https://github.com/DukeLuo/eslint-plugin-check-file
import filenameNamingConvention from './rules/filename-naming-convention'
import folderNamingConvention from './rules/folder-naming-convention'
import filenameBlocklist from './rules/filename-blocklist'
import folderMatchWithFex from './rules/folder-match-with-fex'

export default {
  rules: {
    'filename-naming-convention': filenameNamingConvention,
    'folder-naming-convention': folderNamingConvention,
    'filename-blocklist': filenameBlocklist,
    'folder-match-with-fex': folderMatchWithFex,
  },
}
