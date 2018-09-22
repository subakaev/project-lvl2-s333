import _ from 'lodash';

const tabChar = '  ';

const getIndentForCloseBrace = depth => tabChar.repeat((depth - 1) * 2);
const getIndentForUnchangedNode = depth => tabChar.repeat(depth * 2);
const getIndent = depth => tabChar.repeat(depth * 2 - 1);

const renderValue = (value, depth) => {
  if (!_.isObject(value)) {
    return `${value}`;
  }

  const indent = getIndentForUnchangedNode(depth);

  const keys = _.keys(value).map(key => `${indent}${key}: ${renderValue(value[key], depth + 1)}`);

  return `{\n${_.flatten(keys).join('\n')}\n${getIndentForCloseBrace(depth)}}`;
};

const keyValueToString = (key, value, depth) => `${key}: ${renderValue(value, depth + 1)}`;

const renderAstAsTree = (ast, depth = 1) => {
  const indent = getIndent(depth);
  const indentForUnchanged = getIndentForUnchangedNode(depth);

  const arr = ast.map((node) => {
    const {
      name, type, value1, value2, children,
    } = node;

    switch (type) {
      case 'nested':
        return `${indentForUnchanged}${name}: ${renderAstAsTree(children, depth + 1)}`;
      case 'unchanged':
        return `${indentForUnchanged}${keyValueToString(name, value1, depth)}`;
      case 'added':
        return `${indent}+ ${keyValueToString(name, value2, depth)}`;
      case 'deleted':
        return `${indent}- ${keyValueToString(name, value1, depth)}`;
      case 'changed':
        return [
          `${indent}+ ${keyValueToString(name, value2, depth)}`,
          `${indent}- ${keyValueToString(name, value1, depth)}`,
        ];
      default:
        throw new Error();
    }
  });

  return `{\n${_.flatten(arr).join('\n')}\n${getIndentForCloseBrace(depth)}}`;
};

export default renderAstAsTree;
