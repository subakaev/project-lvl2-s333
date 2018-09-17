import fs from 'fs';
import { has } from 'lodash';

const getUniqueArrayConfigKeys = (config1, config2) => {
  const uniqueKeysSet = new Set([...Object.keys(config1), ...Object.keys(config2)]);

  return [...uniqueKeysSet];
};

const generateDiffMessage = (key, value, act = '') => {
  const prefix = act === '' ? '' : `${act} `;
  return `${prefix}${key}: ${value}`;
};

export default (configFile1, configFile2) => {
  const content1 = fs.readFileSync(configFile1, 'utf8');
  const content2 = fs.readFileSync(configFile2, 'utf8');

  const config1 = JSON.parse(content1);
  const config2 = JSON.parse(content2);

  const keys = getUniqueArrayConfigKeys(config1, config2);

  const res = keys.reduce((acc, key) => {
    const getKeyDiff = () => {
      const value1 = config1[key];

      if (!has(config2, key)) {
        return generateDiffMessage(key, value1, '-');
      }

      const value2 = config2[key];

      if (!has(config1, key)) {
        return generateDiffMessage(key, value2, '+');
      }

      if (value1 === value2) {
        return generateDiffMessage(key, value1);
      }

      return `${generateDiffMessage(key, value2, '+')}\n  ${generateDiffMessage(key, value1, '-')}`;
    };

    return `${acc}\n  ${getKeyDiff()}`;
  }, '{');

  return `${res}\n}`;
};
