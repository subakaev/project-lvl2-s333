import _ from 'lodash';

const valueRenderers = {
  string: value => `'${value}'`,
  object: () => '[complex value]',
  number: value => value,
  boolean: value => value,
  null: value => value,
  undefined: value => value,
};

const renderValue = value => valueRenderers[typeof value](value);

const renderAstAsPlain = (ast, parentNodes = []) => {
  const rows = ast.map((node) => {
    const {
      name, type, value1, value2, children,
    } = node;

    const nextParentNodes = [...parentNodes, name];
    const propertyName = nextParentNodes.join('.');

    const [value1Str, value2Str] = [renderValue(value1), renderValue(value2)];

    const typeRenderers = {
      nested: () => renderAstAsPlain(children, nextParentNodes),
      unchanged: () => null,
      added: () => `Property '${propertyName}' was added with value: ${value2Str}`,
      deleted: () => `Property '${propertyName}' was removed`,
      changed: () => `Property '${propertyName}' was updated. From ${value1Str} to ${value2Str}`,
    };

    return typeRenderers[type]();
  });

  return _.flatten(rows.filter(x => x)).join('\n');
};

export default renderAstAsPlain;
