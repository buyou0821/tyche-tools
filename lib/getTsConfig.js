const fs = require('fs');
const { getProjectPath } = require('./utils/helper');

module.exports = function() {
  let projectTSConfig = {};
  if (fs.existsSync(getProjectPath('tsconfig.json'))) {
    projectTSConfig = require(getProjectPath('tsconfig.json'));
  }
  return Object.assign(
    {
      noUnusedParameters: true,
      noUnusedLocals: true,
      strictNullChecks: true,
      target: 'es6',
      jsx: 'preserve',
      moduleResolution: 'node',
      declaration: true,
      allowSyntheticDefaultImports: true,
    },
    projectTSConfig.compilerOptions
  );
};
