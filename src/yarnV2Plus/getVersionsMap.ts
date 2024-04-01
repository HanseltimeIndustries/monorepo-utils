import { execSync } from 'child_process'
import { parseMultipleObjectsToJson } from '../utils/parseMultipleObjectsToJson'

interface YarnWhyJson {
  // The package with the dependency
  value: string
  children: {
    [pkgWithVersion: string]: {
      locator: string
      descriptor: string
    }
  }
}

/**
 * Returns a map of versions and the packages that use them for a
 * yarn 2+ system
 *
 * @param pkg
 * @returns
 */
export function getVersionsMap(pkg: string): Map<string, string[]> {
  const rawOutput = execSync(`yarn why ${pkg} --json`).toString()
  const versionObjects = parseMultipleObjectsToJson<YarnWhyJson>(rawOutput)

  const versionMap = new Map<string, string[]>()
  versionObjects.forEach((vObj) => {
    const versionKey = Object.keys(vObj.children)[0]
    const sepIdx = versionKey.indexOf(':')

    const version = versionKey.substring(sepIdx + 1)
    let parents = versionMap.get(version)
    if (!parents) {
      parents = []
      versionMap.set(version, parents)
    }
    parents.push(vObj.value)
  })
  return versionMap
}
