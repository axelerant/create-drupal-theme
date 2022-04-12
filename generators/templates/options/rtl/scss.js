const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const tailwind = require('tailwindcss');
const gulpIf = require('gulp-if');

const isLocal = typeof process.env.CI === 'undefined';
const postCSSOptions = [autoprefixer(), tailwind()];
<%- rtlValue %>

module.exports = (gulp, config) => {
  gulp.task('scss', () =>
    gulp
      .src(...config.scss.source)
      .pipe(gulpIf(isLocal, sourcemaps.init()))
      .pipe(sassGlob())
      .pipe(sass(config.scss.options).on('error', sass.logError))
      .pipe(postcss(postCSSOptions))
      .pipe(gulpIf(isLocal, sourcemaps.write('../maps')))
      .pipe(gulp.dest(config.scss.destination)),
  );
};
