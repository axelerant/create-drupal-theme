module.exports = (gulp, config) => {
  gulp.task('watch', () => {
    gulp.watch(...config.scss.source, gulp.series('lint:scss', 'scss'));
    gulp.watch(...config.ts.source, gulp.series('lint:ts', 'ts'));
  });
};
