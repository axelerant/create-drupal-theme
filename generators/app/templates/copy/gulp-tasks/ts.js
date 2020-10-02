const typescript = require('gulp-typescript');
const ts = typescript.createProject("tsconfig.json");

module.exports = (gulp, config) => {
  gulp.task('ts', () =>
    gulp
      .src(config.ts.source)
      .pipe(ts())
      .pipe(gulp.dest(config.ts.destination)),
  );
};
