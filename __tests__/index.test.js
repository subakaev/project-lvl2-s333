import gendiff from '../src';

const expectedResult = `{
  host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  - follow: false
  + verbose: true
}`;

const flatPath = '__tests__/__fixtures__/flat/';

test('test gendiff flat json', () => {
  expect(gendiff(`${flatPath}/before.json`, `${flatPath}/after.json`)).toBe(expectedResult);
});

test('test gendiff flat yml', () => {
  expect(gendiff(`${flatPath}/before.yml`, `${flatPath}/after.yml`)).toBe(expectedResult);
});

test('test gendiff flat ini', () => {
  expect(gendiff(`${flatPath}/before.ini`, `${flatPath}/after.ini`)).toBe(expectedResult);
});
