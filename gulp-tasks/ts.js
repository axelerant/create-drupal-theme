const typescript = require('gulp-typescript');

module.exports = (gulp, config) => {
  gulp.task('ts', () =>
    gulp
      .src(config.ts.source)
      .pipe(typescript())
      .pipe(gulp.dest(config.ts.destination)),
  );
};
