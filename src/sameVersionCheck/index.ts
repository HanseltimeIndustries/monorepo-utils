import { getMajorVersion } from '../yarn'
import { getVersionsMap as getVersionsMapYarnV2Plus } from '../yarnV2Plus'

/**
 * A function that returns a map of versions to the packages that use those versions
 */
export type GetVersionsMapFunction = (pkg: string) => Map<string, string[]>

interface SameVersionCheckOptions {
  pkg: string
  pkgManager: 'yarn'
}

/**
 * Checks that the same version is used across the monorepo
 *
 * @param options
 * @returns {string | undefined} an error message if the version mismatched of undefined if no issue
 */
export function sameVersionCheck(options: SameVersionCheckOptions): string | undefined {
  let versionMap: Map<string, string[]>
  let major: number
  switch (options.pkgManager) {
    case 'yarn':
      major = getMajorVersion()
      if (major > 1) {
        versionMap = getVersionsMapYarnV2Plus(options.pkg)
      } else {
        throw new Error(`Unimplemented version check for yarn classic`)
      }
      break
    default:
      throw new Error(`Unimplemented version check for package manager (${options.pkgManager})`)
  }

  if (versionMap.size > 1) {
    let versionStr = ''
    versionMap.forEach((parents, version) => {
      versionStr = `${versionStr}\n${version} from ${parents.join(' ')}`
    })
    return `Multiple versions of ${options.pkg}\n${versionStr}`
  }
}
