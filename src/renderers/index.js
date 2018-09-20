import _ from 'lodash';

const tabChar = '  ';

const renderValue = (value, tabsCount = 1) => {
  if (!_.isObject(value)) {
    return `${value}`;
  }

  const indent = tabChar.repeat(tabsCount + 1);

  const keys = _.keys(value).map(key => `${indent}${key}: ${renderValue(value[key], tabsCount + 2)}`);

  return `{\n${_.flatten(keys).join('\n')}\n${tabChar.repeat(tabsCount)}}`;
};

const keyValueToString = (key, value, tabsCount) => `${key}: ${renderValue(value, tabsCount)}`;

const renderAst = (ast, tabsCount = 1) => {
  const arr = _.keys(ast).map((key) => {
    const node = ast[key];

    const indent = tabChar.repeat(tabsCount);

    switch (node.type) {
      case 'node':
        return `${indent}  ${key}: ${renderAst(node.children, tabsCount + 2)}`;
      case 'unchanged':
        return `${indent}  ${keyValueToString(key, node.value1, tabsCount + 2)}`;
      case 'added':
        return `${indent}+ ${keyValueToString(key, node.value2, tabsCount + 1)}`;
      case 'deleted':
        return `${indent}- ${keyValueToString(key, node.value1, tabsCount + 1)}`;
      case 'both':
        return [
          `${indent}+ ${keyValueToString(key, node.value2, tabsCount + 1)}`,
          `${indent}- ${keyValueToString(key, node.value1, tabsCount + 1)}`,
        ];
      default:
        throw new Error();
    }
  });

  return `{\n${_.flatten(arr).join('\n')}\n${tabChar.repeat(tabsCount - 1)}}`;
};

export default renderAst;
