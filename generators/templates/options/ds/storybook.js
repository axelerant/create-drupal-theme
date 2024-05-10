import { spawn } from 'child_process';

export default (gulp) => {
  gulp.task('sb:build', async () => {
    spawn('./node_modules/.bin/build-storybook', {
      stdio: 'inherit',
    });
  });

  gulp.task('sb:serve', async () => {
    spawn('./node_modules/.bin/start-storybook', ['-p', '3000'], {
      stdio: 'inherit',
    });
  });
};
