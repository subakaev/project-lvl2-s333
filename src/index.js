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

export default (configFile1, configFile2) => {
  const content1 = fs.readFileSync(configFile1, 'utf8');
  const content2 = fs.readFileSync(configFile2, 'utf8');

  const extName = path.extname(configFile1).substring(1);

  const config1 = parseContent(extName, content1);
  const config2 = parseContent(extName, content2);

  const keys = getConfigKeys(config1, config2);

  const diffValues = keys.reduce((acc, key) => {
    const keyDiffs = getDiffsFor(key, config1, config2);

    return _.flatten([...acc, keyDiffs]);
  }, []);

  return `{\n${diffValues.join('\n')}\n}`;
};
