import fs from 'fs';
import _ from 'lodash';
import path from 'path';

import parseContent from './parsers';
import renderAst from './renderers';

const getConfigKeys = (config1, config2) => _.union(_.keys(config1), _.keys(config2));

const generateAst2 = (obj1, obj2) => getConfigKeys(obj1, obj2).map((key) => {
  const value1 = obj1[key];
  const value2 = obj2[key];

  if (!_.has(obj2, key)) {
    return { name: key, type: 'deleted', value1 };
  }

  if (!_.has(obj1, key)) {
    return { name: key, type: 'added', value2 };
  }

  if (_.isObject(value1) && _.isObject(value2)) {
    return { name: key, type: 'node', children: generateAst2(value1, value2) };
  }

  if (value1 === value2) {
    return { name: key, type: 'unchanged', value1 };
  }

  return {
    name: key, type: 'diff', value1, value2,
  };
});

const generateAst = (obj1, obj2) => getConfigKeys(obj1, obj2).reduce((acc, key) => {
  const value1 = obj1[key];
  const value2 = obj2[key];

  if (!_.has(obj2, key)) {
    return { ...acc, [key]: { type: 'deleted', value1 } };
  }

  if (!_.has(obj1, key)) {
    return { ...acc, [key]: { type: 'added', value2 } };
  }

  if (_.isObject(value1) && _.isObject(value2)) {
    return { ...acc, [key]: { type: 'node', children: generateAst(value1, value2) } };
  }

  if (value1 === value2) {
    return { ...acc, [key]: { type: 'unchanged', value1 } };
  }

  return { ...acc, [key]: { type: 'both', value1, value2 } };
}, {});


export default (configFile1, configFile2) => {
  const content1 = fs.readFileSync(configFile1, 'utf8');
  const content2 = fs.readFileSync(configFile2, 'utf8');

  const extName = path.extname(configFile1).substring(1);

  const config1 = parseContent(extName, content1);
  const config2 = parseContent(extName, content2);

  const ast = generateAst2(config1, config2);

  return renderAst(ast);
};
