const inject = require('gulp-inject');
const sort = require('sort-stream');

module.exports = (gulp) => {
  gulp.task('inject:js', () => {
    var target = gulp.src('source/_meta/_foot.twig');
    var sources = gulp.src(['dist/js/**/*.js'], { read: false });

    return target
      .pipe(
        inject(
          sources.pipe(
            sort(function (a, b) {
              return a.path.localeCompare(b.path);
            }),
          ),
        ),
      )
      .pipe(gulp.dest('source/_meta'));
  });

  gulp.task('inject:css', () => {
    var target = gulp.src('source/_meta/_head.twig');
    var sources = gulp.src(['dist/css/**/*.css'], { read: false });

    return target
      .pipe(
        inject(
          sources.pipe(
            sort(function (a, b) {
              return a.path.localeCompare(b.path);
            }),
          ),
        ),
      )
      .pipe(gulp.dest('source/_meta'));
  });

  gulp.task('inject', gulp.series('inject:css', 'inject:js'));
};
