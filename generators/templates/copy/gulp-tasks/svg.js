import svgStore from 'gulp-svgstore';
import imagemin from 'gulp-imagemin';

export default (gulp, config) => {
  gulp.task('svg', () =>
    gulp
      .src(config.svg.source)
      .pipe(imagemin([imagemin.svgo()]))
      .pipe(svgStore())
      .pipe(gulp.dest(config.svg.destination)),
  );
};
