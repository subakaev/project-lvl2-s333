import fs from 'fs';
import { has } from 'lodash';
import yaml from 'js-yaml';
import path from 'path';

const getConfigKeys = (config1, config2) => Object.keys({ ...config1, ...config2 });

const genDiffValue = (key, value, act = '') => {
  const prefix = act === '' ? '' : `${act} `;
  return `  ${prefix}${key}: ${value}`;
};

const getDiffsFor = (key, obj1, obj2) => {
  const value1 = obj1[key];
  const value2 = obj2[key];

  if (!has(obj2, key)) {
    return [genDiffValue(key, value1, '-')];
  }

  if (!has(obj1, key)) {
    return [genDiffValue(key, value2, '+')];
  }

  if (value1 === value2) {
    return [genDiffValue(key, value1)];
  }

  return [genDiffValue(key, value2, '+'), genDiffValue(key, value1, '-')];
};

const getConfigObjects = (configFile1, configFile2) => {
  const content1 = fs.readFileSync(configFile1, 'utf8');
  const content2 = fs.readFileSync(configFile2, 'utf8');

  const extName = path.extname(configFile1);

  switch (extName) {
    case '.yml':
      return [yaml.safeLoad(content1), yaml.safeLoad(content2)];
    default:
      return [JSON.parse(content1), JSON.parse(content2)];
  }
};

export default (configFile1, configFile2) => {
  const [config1, config2] = getConfigObjects(configFile1, configFile2);

  const keys = getConfigKeys(config1, config2);

  const diffValues = keys.reduce((acc, key) => {
    const keyDiffs = getDiffsFor(key, config1, config2);

    return [...acc, ...keyDiffs];
  }, []);

  return `{\n${diffValues.join('\n')}\n}`;
};
