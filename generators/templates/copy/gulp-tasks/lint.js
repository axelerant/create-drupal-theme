import stylelint from '@ronilaukkarinen/gulp-stylelint';
import eslint from 'gulp-eslint-new';
import gulpIf from 'gulp-if';
import typescript from 'gulp-typescript';
const ts = typescript.createProject('tsconfig.json', { noEmit: true });

export default (gulp, config) => {
  gulp.task('lint:stylelint', () =>
    gulp.src(config.scss.all).pipe(stylelint(config.stylelint.options)),
  );

  gulp.task('lint:eslint', () =>
    gulp
      .src(config.ts.source)
      .pipe(eslint())
      .pipe(gulpIf(process.env.CI === 'true', eslint.failOnError())),
  );

  gulp.task('lint:tsc', () => gulp.src(config.ts.source).pipe(ts()));

  gulp.task(
    'lint',
    gulp.series(
      'prettier',
      gulp.parallel('lint:stylelint', 'lint:eslint', 'lint:tsc'),
    ),
  );
};
