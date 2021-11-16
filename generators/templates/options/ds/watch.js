module.exports = (gulp, config) => {
  gulp.task('watch:scss', () => {
    gulp.watch(
      ...config.scss.all,
      gulp.series('lint:stylelint', 'scss'<%- ds.injectCss %>),
    );
  });

  gulp.task('watch:ts', () => {
    gulp.watch(
      ...config.ts.source,
      gulp.series('lint:eslint', 'ts'<%- ds.injectJs %>),
    );
  });

  gulp.task('watch', gulp.series('default', gulp.parallel(<%- ds.dsServe %>'watch:scss', 'watch:ts')));
};
