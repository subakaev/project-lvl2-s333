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
  const beforeCfg = '__tests__/__fixtures__/before.json';
  const afterCfg = '__tests__/__fixtures__/after.json';

  expect(gendiff(beforeCfg, afterCfg)).toBe(expectedResult);
});

test('test gendiff yml', () => {
  const beforeCfg = '__tests__/__fixtures__/before.yml';
  const afterCfg = '__tests__/__fixtures__/after.yml';

  expect(gendiff(beforeCfg, afterCfg)).toBe(expectedResult);
});

test('test gendiff ini', () => {
  const beforeCfg = '__tests__/__fixtures__/before.ini';
  const afterCfg = '__tests__/__fixtures__/after.ini';

  expect(gendiff(beforeCfg, afterCfg)).toBe(expectedResult);
});
