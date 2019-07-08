const fs = require('fs');
const { getProjectPath } = require('./utils/helper');

module.exports = function(modules) {
  let projectTSConfig = {};
  if (fs.existsSync(getProjectPath('tsconfig.json'))) {
    projectTSConfig = require(getProjectPath('tsconfig.json'));
  }

  const module = modules !== false ? 'commonjs' : 'es6';

  return Object.assign(
    {
      module,
      declaration: true,
      noUnusedParameters: true,
      noUnusedLocals: true,
      strictNullChecks: true,
      target: 'es5',
      jsx: 'preserve',
      moduleResolution: 'node',
      allowSyntheticDefaultImports: true,
    },
    projectTSConfig.compilerOptions
  );
};
