import imagemin from 'gulp-imagemin';

export default (gulp, config) => {
  gulp.task('images', () =>
    gulp
      .src(config.images.source)
      .pipe(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 75, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
        ]),
      ),
  );
};
