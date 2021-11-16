const svgStore = require('gulp-svgstore');
const imagemin = require('gulp-imagemin');

module.exports = (gulp, config) => {
  gulp.task('svg', () =>
    gulp
      .src(config.svg.source)
      .pipe(imagemin([imagemin.svgo()]))
      .pipe(svgStore())
      .pipe(gulp.dest(config.svg.destination)),
  );
};
