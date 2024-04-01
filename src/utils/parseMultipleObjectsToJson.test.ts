import { parseMultipleObjectsToJson } from './parseMultipleObjectsToJson'

it('returns the correct objects for multiple listed objects', () => {
  const testStr = `{ "f1": "value1", "f2": { "f3": 22 } }{ "g1": 33, "g2": "something" }\n\t  {"h1": "v1", "h2": []}`
  expect(parseMultipleObjectsToJson(testStr)).toEqual([
    {
      f1: 'value1',
      f2: {
        f3: 22,
      },
    },
    {
      g1: 33,
      g2: 'something',
    },
    {
      h1: 'v1',
      h2: [],
    },
  ])
})

it('returns the correct objects with nested {', () => {
  const testStr = `{ "f1": "{ here" }{ "g2": " } {something" }\n\t  {"h1": "v1", "h2": []}`
  expect(parseMultipleObjectsToJson(testStr)).toEqual([
    {
      f1: '{ here',
    },
    {
      g2: ' } {something',
    },
    {
      h1: 'v1',
      h2: [],
    },
  ])
})
