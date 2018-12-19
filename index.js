'use strict';

const { declare } = require('@babel/helper-plugin-utils');

const defaultTarget = {
  chrome: 69
};

function buildTargets({ additionalTargets }) {
  return Object.assign({}, defaultTarget, additionalTargets);
}

module.exports = declare((api, options) => {
  api.assertVersion(7);

  const {
    modules,
    targets = buildTargets(options),
    removePropTypes,
  } = options;

  if (typeof modules !== 'undefined' && typeof modules !== 'boolean' && modules !== 'auto') {
    throw new TypeError('babel-preset-harumi-engine only accepts `true`, `false`, or `"auto"` as the value of the "modules" option');
  }

  const debug = typeof options.debug === 'boolean' ? options.debug : false;

  const development = typeof options.development === 'boolean'
    ? options.development
    : api.cache.using(() => process.env.NODE_ENV === 'development');

  const presetEnvModules = (modules === false) ? false : 'auto';

  return {
    presets: [
      //Latest Ecmascript - ESNext
      [require('@babel/preset-env'), {debug, targets, modules: presetEnvModules, useBuiltIns: "entry"}],
      //Type checking
      [require('@babel/preset-flow'), {development}],
      //Support for react JSX
      [require('@babel/preset-react'), {development}],
    ],
    plugins: [
      //Stage 0 plugins:
      require('@babel/plugin-proposal-function-bind'),
      //Stage 1 plugins:
      require('@babel/plugin-proposal-export-default-from'),
      require('@babel/plugin-proposal-logical-assignment-operators'),
      [require('@babel/plugin-proposal-optional-chaining'), { loose: false }],
      [require('@babel/plugin-proposal-pipeline-operator'), { proposal: 'minimal' }],
      [require('@babel/plugin-proposal-nullish-coalescing-operator'), { loose: false }],
      require('@babel/plugin-proposal-do-expressions'),
      //Stage 2 plugins:
      [require('@babel/plugin-proposal-decorators'), { legacy: true }],
      require('@babel/plugin-proposal-function-sent'),
      require('@babel/plugin-proposal-export-namespace-from'),
      require('@babel/plugin-proposal-numeric-separator'),
      require('@babel/plugin-proposal-throw-expressions'),
      //Stage 3 plugins:
      require('@babel/plugin-syntax-dynamic-import'),
      require('@babel/plugin-syntax-import-meta'),
      [require('@babel/plugin-proposal-class-properties'), { loose: false }],
      require('@babel/plugin-proposal-json-strings')
    ].filter(Boolean),
  };
});