import fs from 'fs';

import gendiff from '../src';

describe('test cfg files with flat structure', () => {
  const flatPath = '__tests__/__fixtures__/flat';

  const expectedResult = fs.readFileSync(`${flatPath}/expected.txt`, 'utf8');

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

describe('test cfg files with tree structure', () => {
  const treePath = '__tests__/__fixtures__/tree';

  const expectedTreeResult = fs.readFileSync(`${treePath}/expected.txt`, 'utf8');

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
