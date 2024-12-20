import inject from 'gulp-inject';
import sort from 'sort-stream';

export default (gulp) => {
  gulp.task('inject:js', () => {
    const target = gulp.src('patternlab/_meta/js.twig');
    const sources = gulp.src(['dist/components/**/*.js'], { read: false });

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
      .pipe(gulp.dest('patternlab/_meta'));
  });

  gulp.task('inject:css', () => {
    const target = gulp.src('patternlab/_meta/css.twig');
    const sources = gulp.src(['dist/components/**/*.css'], { read: false });

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
      .pipe(gulp.dest('patternlab/_meta'));
  });

  gulp.task('inject', gulp.series('inject:css', 'inject:js'));
};
