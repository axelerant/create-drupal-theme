import imagemin, { gifsicle, mozjpeg, optipng } from 'gulp-imagemin';

export default (gulp, config) => {
  gulp.task('images', () =>
    gulp
      .src(config.images.source)
      .pipe(
        imagemin([
          gifsicle({ interlaced: true }),
          mozjpeg({ quality: 75, progressive: true }),
          optipng({ optimizationLevel: 5 }),
        ]),
      ),
  );
};
