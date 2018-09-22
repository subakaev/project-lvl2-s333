import fs from 'fs';
import _ from 'lodash';
import path from 'path';

import parseContent from './parsers';
import getRenderer from './renderers';

const getConfigKeys = (config1, config2) => _.union(_.keys(config1), _.keys(config2));

const astNodeMatchers = [
  {
    type: 'deleted',
    isMatch: (key, obj1, obj2) => _.has(obj1, key) && !_.has(obj2, key),
    getValues: value1 => ({ value1 }),
  },
  {
    type: 'added',
    isMatch: (key, obj1, obj2) => !_.has(obj1, key) && _.has(obj2, key),
    getValues: (_value1, value2) => ({ value2 }),
  },
  {
    type: 'node',
    isMatch: (key, obj1, obj2) => _.has(obj1, key) && _.has(obj2, key)
      && _.isObject(obj1[key]) && _.isObject(obj2[key]),
    getValues: (value1, value2, genAstFn) => ({ children: genAstFn(value1, value2) }),
  },
  {
    type: 'unchanged',
    isMatch: (key, obj1, obj2) => _.has(obj1, key) && _.has(obj2, key) && obj1[key] === obj2[key],
    getValues: value1 => ({ value1 }),
  },
  {
    type: 'diff',
    isMatch: (key, obj1, obj2) => _.has(obj1, key) && _.has(obj2, key) && obj1[key] !== obj2[key],
    getValues: (value1, value2) => ({ value1, value2 }),
  },
];

const generateAst2 = (obj1, obj2) => getConfigKeys(obj1, obj2).map((key) => {
  const value1 = obj1[key];
  const value2 = obj2[key];

  const matcher = _.find(astNodeMatchers, m => m.isMatch(key, obj1, obj2));

  const values = matcher.getValues(value1, value2, generateAst2);

  return {
    name: key,
    type: matcher.type,
    value1: values.value1,
    value2: values.value2,
    children: values.children,
  };
});

const generateAst = (obj1, obj2) => getConfigKeys(obj1, obj2).map((key) => {
  const value1 = obj1[key];
  const value2 = obj2[key];

  if (!_.has(obj2, key)) {
    return { name: key, type: 'deleted', value1 };
  }

  if (!_.has(obj1, key)) {
    return { name: key, type: 'added', value2 };
  }

  if (_.isObject(value1) && _.isObject(value2)) {
    return { name: key, type: 'node', children: generateAst(value1, value2) };
  }

  if (value1 === value2) {
    return { name: key, type: 'unchanged', value1 };
  }

  return {
    name: key, type: 'diff', value1, value2,
  };
});

export default (configFile1, configFile2, renderFormat = 'tree') => {
  const content1 = fs.readFileSync(configFile1, 'utf8');
  const content2 = fs.readFileSync(configFile2, 'utf8');

  const extName = path.extname(configFile1).substring(1);

  const config1 = parseContent(extName, content1);
  const config2 = parseContent(extName, content2);

  const ast = generateAst2(config1, config2);

  return getRenderer(renderFormat)(ast);
};
