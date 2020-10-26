const stylelint = require('gulp-stylelint');
const eslint = require('gulp-eslint');
const gulpIf = require('gulp-if');

module.exports = (gulp, config) => {
  gulp.task('lint:scss', () =>
    gulp.src(config.scss.all).pipe(stylelint(config.stylelint.options)),
  );

  gulp.task('lint:ts', () =>
    gulp
      .src(config.ts.source)
      .pipe(eslint())
      .pipe(gulpIf(process.env.CI === 'true', eslint.failOnError())),
  );

  gulp.task(
    'lint',
    gulp.series('prettier', gulp.parallel('lint:scss', 'lint:ts')),
  );
};
