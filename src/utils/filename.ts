/**
 * Utils about filename
 */

import path from 'node:path'
import { WINDOWS_DRIVE_LETTER_REGEXP } from '../constants/regex'
import { isNotEmpty, pipe } from './utility'

/**
 * @returns {string} filename without path
 * @param {string} p filename concat with path in posix style
 */
const getFilename = p => path.posix.basename(p)

/**
 * @returns {string} path of folder
 * @param {string} p filename concat with path in posix style
 */
function getFolderPath(p) {
  return path.posix.join(path.posix.dirname(p), path.posix.sep)
}

/**
 * @returns {string} base name
 * @param {string} filename filename without path
 * @param {boolean} [ignoreMiddleExtensions=false] flag to ignore middle extensions
 */
function getBasename(filename, ignoreMiddleExtensions = false) {
  return filename.substring(
    0,
    ignoreMiddleExtensions ? filename.indexOf('.') : filename.lastIndexOf('.'),
  )
}

/**
 * @returns {string[]} all folders
 * @param {string} p path of folder in posix style
 */
const getAllFolders = p => p.split(path.posix.sep).filter(isNotEmpty)

/**
 * @returns {string[]} all sub paths
 * @param {string} p path of folder in posix style
 */
function getSubPaths(p) {
  const folders = getAllFolders(p)
  let subPaths = []

  const handler = array =>
    array.reduce((acc, folder, index) => {
      if (folder) {
        acc.push(
          index === 0
            ? path.posix.join(folder, path.posix.sep)
            : path.posix.join(acc[acc.length - 1], folder, path.posix.sep),
        )
      }
      return acc
    }, [])

  for (let i = 0; i < folders.length; i++)
    subPaths = subPaths.concat(handler(folders.slice(i)))

  return subPaths
}

/**
 * @returns {string} path from repository root
 * @param {string} fullPath filename with full path
 * @param {string} repositoryRoot path of repository root
 */
function getPathFromRepositoryRoot(fullPath, repositoryRoot) {
  return fullPath.replace(path.join(repositoryRoot, path.sep), '')
}

/**
 * @returns {string} file path in posix style
 * @param {string} p file path based on the operating system
 */
const toPosixPath = p => p.split(path.sep).join(path.posix.sep)

/**
 * @returns {string} file path without drive letter on windows
 * @param {string} p file path on windows
 */
const removeDriveLetter = p => p.replace(WINDOWS_DRIVE_LETTER_REGEXP, '')

/**
 * @returns {string} file path in posix style
 * @param {import('eslint').Rule.RuleContext} context rule eslint context
 */
function getFilePath(context) {
  const pathFromRoot = getPathFromRepositoryRoot(
    context.getPhysicalFilename(),
    context.getCwd(),
  )

  return pipe(removeDriveLetter, toPosixPath)(pathFromRoot)
}

export {
  getFolderPath,
  getFilename,
  getBasename,
  getSubPaths,
  getAllFolders,
  getFilePath,
}
