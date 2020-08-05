const browserSync = require('browser-sync');
const server = browserSync.create();

const reload = (done) => {
  server.reload();
  done();
};

module.exports = (gulp, config) => {
  gulp.task('watch', () => {
    server.init(config.browserSync);
    gulp.watch(...config.scss.source, gulp.series('lint:scss', 'scss', reload));
    gulp.watch(...config.ts.source, gulp.series('lint:ts', 'ts', reload));
  });
};
