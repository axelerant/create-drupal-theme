const typescript = require('gulp-typescript');
const ts = typescript.createProject('tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');

module.exports = (gulp, config) => {
  gulp.task('ts', () =>
    gulp
      .src(config.ts.source)
      .pipe(sourcemaps.init())
      .pipe(ts())
      .pipe(sourcemaps.write('../maps'))
      .pipe(gulp.dest(config.ts.destination)),
  );
};
