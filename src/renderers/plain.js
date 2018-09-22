import _ from 'lodash';

const renderPlainValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (_.isString(value)) {
    return `'${value}'`;
  }

  return value;
};

const renderAstAsPlain = (ast, parentNodes = []) => {
  const rows = ast.map((node) => {
    const {
      name, type, value1, value2, children,
    } = node;

    const nextParentNodes = [...parentNodes, name];
    const propertyName = nextParentNodes.join('.');

    const value1Str = renderPlainValue(value1);
    const value2Str = renderPlainValue(value2);

    switch (type) {
      case 'nested':
        return renderAstAsPlain(children, nextParentNodes);
      case 'unchanged':
        return null;
      case 'added':
        return `Property '${propertyName}' was added with value: ${value2Str}`;
      case 'deleted':
        return `Property '${propertyName}' was removed`;
      case 'changed':
        return `Property '${propertyName}' was updated. From ${value1Str} to ${value2Str}`;
      default:
        throw new Error();
    }
  });

  return _.flatten(rows.filter(x => x)).join('\n');
};

export default renderAstAsPlain;
