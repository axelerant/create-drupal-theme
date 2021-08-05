const { spawn } = require('child_process');
const build = require('@pattern-lab/cli/bin/build');
const config = require('../patternlab-config.json');

module.exports = (gulp) => {
  gulp.task('pl:build', async () => {
    await build(config, { cleanPublic: config.cleanPublic });
  });

  gulp.task('pl:serve', async () => {
    spawn('./node_modules/.bin/patternlab', ['serve'], {
      stdio: 'inherit',
    });
  });
};
