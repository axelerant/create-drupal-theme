const { spawn } = require('child_process');

module.exports = (gulp) => {
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
