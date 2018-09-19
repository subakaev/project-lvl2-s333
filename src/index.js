import fs from 'fs';
import _ from 'lodash';
import path from 'path';

import parseContent from './parsers';

const getConfigKeys = (config1, config2) => _.union(_.keys(config1), _.keys(config2));

const genDiffValue = (key, value, act = '') => {
  const prefix = act === '' ? '' : `${act} `;
  return `  ${prefix}${key}: ${value}`;
};

const getDiffsFor = (key, obj1, obj2) => {
  const value1 = obj1[key];
  const value2 = obj2[key];

  if (!_.has(obj2, key)) {
    return genDiffValue(key, value1, '-');
  }

  if (!_.has(obj1, key)) {
    return genDiffValue(key, value2, '+');
  }

  if (value1 === value2) {
    return genDiffValue(key, value1);
  }

  return [genDiffValue(key, value2, '+'), genDiffValue(key, value1, '-')];
};

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

  const keys = getConfigKeys(config1, config2);

  // console.log(JSON.stringify(generateAst(config1, config2), null, '  '));

  const diffValues = keys.reduce((acc, key) => {
    const keyDiffs = getDiffsFor(key, config1, config2);

    return _.flatten([...acc, keyDiffs]);
  }, []);

  return `{\n${diffValues.join('\n')}\n}`;
};
