/**
 * Simple function to take a string of multiple json objects (that are not wrapped in an upper json)
 * and returns the parsed Json objects as an array
 *
 * Example:  { "foo": "thing" } { "bar": "something" }
 *
 * @param s
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseMultipleObjectsToJson<T = any>(s: string): T[] {
  let openBrackets = 0
  let startObjIdx = -1
  const objs = []
  let inQuotes = false
  let previousBackslash = false

  // For each element in the string
  for (let i = 0; i < s.length; i++) {
    switch (s.charAt(i)) {
      case '{':
        if (!inQuotes) {
          if (openBrackets === 0) {
            startObjIdx = i
          }
          openBrackets++
        }
        break
      case '}':
        if (!inQuotes) {
          openBrackets--
          if (openBrackets === 0) {
            objs.push(JSON.parse(s.substring(startObjIdx, i + 1)))
          }
        }
        break
      case '"':
        // If not escaped, invert the quotes
        if (!previousBackslash) {
          inQuotes = !inQuotes
        }
        break
      case '\\':
        previousBackslash = true
        break
      default:
        previousBackslash = false
    }
  }
  return objs
}
