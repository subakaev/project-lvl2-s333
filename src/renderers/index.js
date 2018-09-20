import renderAstAsTree from './tree';
import renderAstAsPlain from './plain';
import renderAstAsJSON from './json';

export default (renderFormat) => {
  const renderers = {
    tree: renderAstAsTree,
    plain: renderAstAsPlain,
    json: renderAstAsJSON,
  };

  return renderers[renderFormat] || renderers.tree;
};
