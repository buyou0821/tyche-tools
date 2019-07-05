const { resolve } = require('./utils/helper');

module.exports = modules => ({
  presets: [
    resolve('@babel/preset-react'),
    [
      resolve('@babel/preset-env'),
      {
        modules,
        targets: {
          browsers: [
            'last 2 versions',
            'Firefox ESR',
            '> 1%',
            'ie >= 9',
            'iOS >= 8',
            'Android >= 4',
          ],
        },
      },
    ],
    resolve('@babel/preset-typescript'),
  ],
  plugins: [
    resolve('@babel/plugin-transform-runtime'),
    resolve('@babel/plugin-proposal-class-properties'),
    resolve('@babel/plugin-proposal-object-rest-spread'),
  ],
});
