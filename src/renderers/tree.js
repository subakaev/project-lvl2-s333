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

    const typeRenderers = {
      nested: () => `${indentForUnchanged}${name}: ${renderAstAsTree(children, depth + 1)}`,
      unchanged: () => `${indentForUnchanged}${keyValueToString(name, value1, depth)}`,
      added: () => `${indent}+ ${keyValueToString(name, value2, depth)}`,
      deleted: () => `${indent}- ${keyValueToString(name, value1, depth)}`,
      changed: () => [
        `${indent}+ ${keyValueToString(name, value2, depth)}`,
        `${indent}- ${keyValueToString(name, value1, depth)}`,
      ],
    };

    return typeRenderers[type]();
  });

  return `{\n${_.flatten(arr).join('\n')}\n${getIndentForCloseBrace(depth)}}`;
};

export default renderAstAsTree;
