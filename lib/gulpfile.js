const { parallel, src, dest } = require('gulp');
const rimraf = require('rimraf');
const debug = require('gulp-debug');
const scss = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const babelrc = require('./babelConfig');

const esDir = 'es';
const libDir = 'lib';
const scssSource = 'components/**/*.scss';
const styleSource = 'components/**/style/index.tsx';
const source = ['components/*/*.tsx', 'components/*/style/*.tsx', 'components/*/*.ts'];

function clean(path) {
  rimraf.sync(path);
}

function copyScss(modules) {
  const title = modules !== false ? 'scss -> lib' : 'scss -> es';
  return new Promise((resolve, reject) => {
    src(scssSource)
      // .pipe(debug({ title }))
      .on('error', reject)
      .pipe(dest(modules !== false ? libDir : esDir))
      .on('end', resolve);
  });
}

function scss2css(modules) {
  const title = modules !== false ? 'css -> lib' : 'css -> es';
  return new Promise((resolve, reject) => {
    src(scssSource)
      // .pipe(debug({ title }))
      .pipe(scss())
      .pipe(postcss([autoprefixer(), cssnano()]))
      .on('error', reject)
      .pipe(dest(modules !== false ? libDir : esDir))
      .on('end', resolve);
  });
}

function buildCssJS(modules) {
  return new Promise((resolve, reject) => {
    src(styleSource)
      .pipe(replace(/\.scss/g, '.css'))
      .pipe(babel(babelrc(modules)))
      .pipe(
        rename({
          basename: 'css',
          extname: '.js',
        })
      )
      .on('error', reject)
      .pipe(dest(modules !== false ? libDir : esDir))
      .on('end', resolve);
  });
}

function ts2js(modules) {
  const title = modules !== false ? 'ts -> lib' : 'ts -> es';
  return new Promise((resolve, reject) => {
    src(source)
      // .pipe(debug({ title }))
      .pipe(babel(babelrc(modules)))
      .on('error', reject)
      .pipe(dest(modules !== false ? libDir : esDir))
      .on('end', resolve);
  });
}

function compile(modules) {
  const dir = modules !== false ? libDir : esDir;
  clean(dir);
  return Promise.all([
    copyScss(modules),
    scss2css(modules),
    buildCssJS(modules),
    ts2js(modules),
  ]).catch(err => {
    console.log(err);
  });
}

function compileWithEs() {
  console.log('[Parallel] Compile to es...');
  return compile(false);
}

function compileWithCommon() {
  console.log('[Parallel] Compile to js...');
  return compile();
}

exports.compile = parallel(compileWithEs, compileWithCommon);
