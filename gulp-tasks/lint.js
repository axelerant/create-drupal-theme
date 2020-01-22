const stylelint = require('gulp-stylelint');
const eslint = require('gulp-eslint');

module.exports = (gulp, config) => {
  gulp.task('lint:scss', () =>
    gulp.src(config.scss.source).pipe(stylelint(config.stylelint.options)),
  );

  gulp.task('lint:ts', () =>
    gulp
      .src(config.ts.source)
      .pipe(eslint())
      .pipe(eslint.format()),
  );

  gulp.task('lint', gulp.parallel('lint:scss', 'lint:ts'));
};
