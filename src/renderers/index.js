import renderAstAsTree from './tree';
import renderAstAsPlain from './plain';

export default (renderFormat) => {
  const renderers = {
    tree: renderAstAsTree,
    plain: renderAstAsPlain,
  };

  return renderers[renderFormat] || renderers.tree;
};
