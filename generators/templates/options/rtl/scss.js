import autoprefixer from 'autoprefixer';
const cssnano = require('cssnano');
import postcss from 'gulp-postcss';
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass);
import sassGlob from 'gulp-sass-glob';
import sassGlob from 'gulp-sass-glob';
import sourcemaps from 'gulp-sourcemaps';
import tailwind from 'tailwindcss';
import gulpIf from 'gulp-if';

const isLocal = typeof process.env.CI === 'undefined';
const postCSSOptions = [autoprefixer(), tailwind()];
// <%- rtlValue %>

export default (gulp, config) => {
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
