module.exports = (gulp, config) => {
  gulp.task('watch:scss', () => {
    gulp.watch(
      ...config.scss.all,
      gulp.series('lint:stylelint', 'scss'<%- pl.injectCss %>),
    );
  });

  gulp.task('watch:ts', () => {
    gulp.watch(
      ...config.ts.source,
      gulp.series('lint:eslint', 'ts'<%- pl.injectJs %>),
    );
  });

  gulp.task('watch', gulp.series('default', gulp.parallel(<%- pl.plServe %>'watch:scss', 'watch:ts')));
};
