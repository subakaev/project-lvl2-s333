import _ from 'lodash';

const tab = '  ';

const renderValue = (value, tabs = 1) => {
  if (!_.isObject(value)) {
    return `${value}`;
  }

  const indent = tab.repeat(tabs + 1);

  const keys = _.keys(value).map(key => `${indent}${key}: ${renderValue(value[key], tabs + 2)}`);

  return `{\n${_.flatten(keys).join('\n')}\n${tab.repeat(tabs)}}`;
};

const keyValueToString = (key, value, tabs) => `${key}: ${renderValue(value, tabs)}`;

const renderer = (ast, tabs = 1) => {
  const arr = _.keys(ast).map((key) => {
    const node = ast[key];

    const newIndent = tab.repeat(tabs);

    switch (node.type) {
      case 'unchanged':
        if (!node.children) {
          return `${newIndent}  ${keyValueToString(key, node.value1, tabs + 2)}`;
        }

        return `${newIndent}  ${key}: ${renderer(node.children, tabs + 2)}`;
      case 'added':
        return `${newIndent}+ ${keyValueToString(key, node.value2, tabs + 1)}`;
      case 'deleted':
        return `${newIndent}- ${keyValueToString(key, node.value1, tabs + 1)}`;
      case 'both':
        return [
          `${newIndent}+ ${keyValueToString(key, node.value2, tabs + 1)}`,
          `${newIndent}- ${keyValueToString(key, node.value1, tabs + 1)}`,
        ];
      default:
        throw new Error();
    }
  });

  return `{\n${_.flatten(arr).join('\n')}\n${tab.repeat(tabs - 1)}}`;
};

export default renderer;
