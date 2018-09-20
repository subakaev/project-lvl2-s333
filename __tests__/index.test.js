import fs from 'fs';

import gendiff from '../src';

const fixturesPath = '__tests__/__fixtures__';

const getExpectedResult = path => fs.readFileSync(path, 'utf8');

describe('test cfg files with flat structure', () => {
  const flatPath = `${fixturesPath}/flat`;

  describe('test tree renderer', () => {
    const expectedResult = getExpectedResult(`${flatPath}/expected.txt`);

    test('test gendiff flat json', () => {
      expect(gendiff(`${flatPath}/before.json`, `${flatPath}/after.json`)).toEqual(expectedResult);
    });

    test('test gendiff flat yml', () => {
      expect(gendiff(`${flatPath}/before.yml`, `${flatPath}/after.yml`)).toEqual(expectedResult);
    });

    test('test gendiff flat ini', () => {
      expect(gendiff(`${flatPath}/before.ini`, `${flatPath}/after.ini`)).toEqual(expectedResult);
    });
  });

  describe('test plain renderer', () => {
    const expectedResult = getExpectedResult(`${flatPath}/expectedPlain.txt`);

    test('test gendiff flat json', () => {
      expect(gendiff(`${flatPath}/before.json`, `${flatPath}/after.json`, 'plain')).toEqual(expectedResult);
    });
  });
});

describe('test cfg files with tree structure and tree renderer', () => {
  const treePath = `${fixturesPath}/tree`;

  const expectedTreeResult = getExpectedResult(`${treePath}/expected.txt`);

  test('test gendiff tree json', () => {
    expect(gendiff(`${treePath}/before.json`, `${treePath}/after.json`)).toBe(expectedTreeResult);
  });

  test('test gendiff tree yml', () => {
    expect(gendiff(`${treePath}/before.yml`, `${treePath}/after.yml`)).toBe(expectedTreeResult);
  });

  test('test gendiff tree ini', () => {
    expect(gendiff(`${treePath}/before.ini`, `${treePath}/after.ini`)).toBe(expectedTreeResult);
  });
});
