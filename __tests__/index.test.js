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

const expectedTreeResult = `{
  common: {
    + follow: false
      setting1: Value 1
    - setting2: 200
    - setting3: true
    + setting3: {
          key: value
      }
      setting6: {
          key: value
        + ops: vops
      }
    + setting4: blah blah
    + setting5: {
          key5: value5
      }
  }
  group1: {
    + baz: bars
    - baz: bas
      foo: bar
    - nest: {
          key: value
      }
    + nest: str
  }
- group2: {
      abc: 12345
  }
+ group3: {
      fee: 100500
  }
}`;

const treePath = '__tests__/__fixtures__/tree/';

test('test gendiff tree json', () => {
  expect(gendiff(`${treePath}/before.json`, `${treePath}/after.json`)).toBe(expectedTreeResult);
});

test('test gendiff tree yml', () => {
  expect(gendiff(`${treePath}/before.yml`, `${treePath}/after.yml`)).toBe(expectedTreeResult);
});

test('test gendiff tree ini', () => {
  expect(gendiff(`${treePath}/before.ini`, `${treePath}/after.ini`)).toBe(expectedTreeResult);
});
