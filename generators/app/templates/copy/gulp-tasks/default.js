module.exports = (gulp) =>
  gulp.task(
    'default',
    gulp.series(
      gulp.parallel('scss', 'ts', 'svg', 'lint', 'prettier', 'images'),
    ),
  );
