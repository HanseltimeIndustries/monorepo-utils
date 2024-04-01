import { execSync } from 'child_process'

export function getMajorVersion() {
  const version = execSync('yarn --version').toString()
  const match = /(?<major>\d+)\.\d+.\d+/.exec(version)

  const major = match?.groups?.['major']
  if (!major) {
    throw new Error('Could not find yarn version')
  }
  return parseInt(major)
}
