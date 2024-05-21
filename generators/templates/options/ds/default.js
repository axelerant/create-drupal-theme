export default (gulp) =>
  gulp.task(
    'default',
    gulp.series(
      'clean',
      gulp.parallel('scss', 'ts', 'svg', 'lint', 'prettier', 'images'),<%- ds.dsBuild %>
    ),
  );
