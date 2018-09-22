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
    getMatchedResult: value1 => ({ value1 }),
  },
  {
    type: 'added',
    isMatch: (key, obj1, obj2) => !_.has(obj1, key) && _.has(obj2, key),
    getMatchedResult: (_value1, value2) => ({ value2 }),
  },
  {
    type: 'node',
    isMatch: (key, obj1, obj2) => _.has(obj1, key) && _.has(obj2, key)
      && _.isObject(obj1[key]) && _.isObject(obj2[key]),
    getMatchedResult: (value1, value2, genAstFn) => ({ children: genAstFn(value1, value2) }),
  },
  {
    type: 'unchanged',
    isMatch: (key, obj1, obj2) => _.has(obj1, key) && _.has(obj2, key) && obj1[key] === obj2[key],
    getMatchedResult: value1 => ({ value1 }),
  },
  {
    type: 'diff',
    isMatch: (key, obj1, obj2) => _.has(obj1, key) && _.has(obj2, key) && obj1[key] !== obj2[key],
    getMatchedResult: (value1, value2) => ({ value1, value2 }),
  },
];

const generateAst = (obj1, obj2) => getConfigKeys(obj1, obj2).map((key) => {
  const { type, getMatchedResult } = _.find(astNodeMatchers, m => m.isMatch(key, obj1, obj2));

  const { value1, value2, children } = getMatchedResult(obj1[key], obj2[key], generateAst);

  return {
    name: key, type, value1, value2, children,
  };
});

export default (configFile1, configFile2, renderFormat = 'tree') => {
  const content1 = fs.readFileSync(configFile1, 'utf8');
  const content2 = fs.readFileSync(configFile2, 'utf8');

  const extName = path.extname(configFile1).substring(1);

  const config1 = parseContent(extName, content1);
  const config2 = parseContent(extName, content2);

  const ast = generateAst(config1, config2);

  return getRenderer(renderFormat)(ast);
};
