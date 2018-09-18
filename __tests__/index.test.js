import gendiff from '../src';

const expectedResult = `{
  host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  - follow: false
  + verbose: true
}`;

test('test gendiff json', () => {
  expect(gendiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json')).toBe(expectedResult);
});

test('test gendiff yml', () => {
  expect(gendiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml')).toBe(expectedResult);
});
