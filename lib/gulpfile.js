const { series, src, dest } = require('gulp');
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
const scssSource = 'components/**/*.scss';
const styleSource = 'components/**/style/index.tsx';
const source = ['components/*/*.tsx', 'components/*/style/*.tsx'];

function clean(path) {
  rimraf.sync(path);
}

function copyScss() {
  const title = 'scss -> es';
  return new Promise((resolve, reject) => {
    src(scssSource)
      .pipe(debug({ title }))
      .on('error', reject)
      .pipe(dest(esDir))
      .on('end', resolve);
  });
}

function scss2css() {
  const title = 'css -> es';
  return new Promise((resolve, reject) => {
    src(scssSource)
      .pipe(debug({ title }))
      .pipe(scss())
      .pipe(postcss([autoprefixer(), cssnano()]))
      .on('error', reject)
      .pipe(dest(esDir))
      .on('end', resolve);
  });
}

function buildStyleJS() {
  return new Promise((resolve, reject) => {
    src(styleSource)
      .pipe(replace(/\.scss/g, '.css'))
      .pipe(
        rename({
          basename: 'css',
          extname: '.js',
        })
      )
      .on('error', reject)
      .pipe(dest(esDir))
      .on('end', resolve);
  });
}

function ts2js() {
  const title = 'ts -> es';
  return new Promise((resolve, reject) => {
    src(source)
      .pipe(debug({ title }))
      .pipe(babel(babelrc(false)))
      .on('error', reject)
      .pipe(dest(esDir))
      .on('end', resolve);
  });
}

function compileWithEs() {
  clean(esDir);
  return Promise.all([copyScss(), scss2css(), buildStyleJS(), ts2js()]).catch(err => {
    console.log(err);
  });
}

exports.compile = series(compileWithEs);
