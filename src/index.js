import fs from 'fs';
import _ from 'lodash';
import path from 'path';

import parseContent from './parsers';
import renderer from './renderers';

const getConfigKeys = (config1, config2) => _.union(_.keys(config1), _.keys(config2));

const generateAst = (obj1, obj2) => getConfigKeys(obj1, obj2).reduce((acc, key) => {
  const value1 = obj1[key];
  const value2 = obj2[key];

  if (!_.has(obj2, key)) {
    return { ...acc, [key]: { type: 'deleted', value: value1 } };
  }

  if (!_.has(obj1, key)) {
    return { ...acc, [key]: { type: 'added', value: value2 } };
  }

  if (_.isObject(value1) && _.isObject(value2)) {
    return { ...acc, [key]: { type: 'unchanged', children: generateAst(value1, value2) } };
  }

  if (value1 === value2) {
    return { ...acc, [key]: { type: 'unchanged', value: value1 } };
  }

  return { ...acc, [key]: { type: 'both', value: value1, value2 } };
}, {});


export default (configFile1, configFile2) => {
  const content1 = fs.readFileSync(configFile1, 'utf8');
  const content2 = fs.readFileSync(configFile2, 'utf8');

  const extName = path.extname(configFile1).substring(1);

  const config1 = parseContent(extName, content1);
  const config2 = parseContent(extName, content2);

  const ast = generateAst(config1, config2);

  return renderer(ast);
};
