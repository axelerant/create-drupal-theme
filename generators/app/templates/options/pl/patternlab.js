const build = require('@pattern-lab/cli/bin/build');
const serve = require('@pattern-lab/cli/bin/serve');
const config = require('../patternlab-config.json');

module.exports = (gulp) => {
  gulp.task('pl:build', async () => {
    await build(config, { cleanPublic: config.cleanPublic });
  });

  gulp.task('pl:serve', async () => {
    serve(config, { cleanPublic: config.cleanPublic });
  });
};
