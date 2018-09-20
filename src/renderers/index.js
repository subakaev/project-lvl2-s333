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
      case 'node':
        return `${indentForUnchanged}${name}: ${renderAstAsTree(children, depth + 1)}`;
      case 'unchanged':
        return `${indentForUnchanged}${keyValueToString(name, value1, depth)}`;
      case 'added':
        return `${indent}+ ${keyValueToString(name, value2, depth)}`;
      case 'deleted':
        return `${indent}- ${keyValueToString(name, value1, depth)}`;
      case 'diff':
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

const renderPlainValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (_.isString(value)) {
    return `'${value}'`;
  }

  return value;
};

const renderAstAsPlain = (ast, prefix = '') => {
  const rows = ast.map((node) => {
    const {
      name, type, value1, value2, children,
    } = node;

    const propertyName = prefix !== '' ? `${prefix}.${name}` : name;

    const value1Str = renderPlainValue(value1);
    const value2Str = renderPlainValue(value2);

    switch (type) {
      case 'node':
        return renderAstAsPlain(children, `${propertyName}`);
      case 'unchanged':
        return null;
      case 'added':
        return `Property '${propertyName}' was added with value: ${value2Str}`;
      case 'deleted':
        return `Property '${propertyName}' was removed`;
      case 'diff':
        return `Property '${propertyName}' was updated. From ${value1Str} to ${value2Str}`;
      default:
        throw new Error();
    }
  });

  return _.flatten(rows.filter(x => x)).join('\n');
};

export default (renderFormat) => {
  const renderers = {
    tree: renderAstAsTree,
    plain: renderAstAsPlain,
  };

  return renderers[renderFormat] || renderers.tree;
};
