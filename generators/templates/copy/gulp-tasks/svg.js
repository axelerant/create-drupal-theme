import svgStore from 'gulp-svgstore';
import imagemin, { svgo } from 'gulp-imagemin';

export default (gulp, config) => {
  gulp.task('svg', () =>
    gulp
      .src(config.svg.source)
      .pipe(imagemin([svgo()]))
      .pipe(svgStore())
      .pipe(gulp.dest(config.svg.destination)),
  );
};
