const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const build = require('@pattern-lab/cli/bin/build');
const config = require('../patternlab-config.json');

module.exports = (gulp) => {
  const jsFile = path.join(__dirname, '../patternlab/_meta/js.twig');
  if (!fs.existsSync(jsFile)) {
    fs.writeFileSync(jsFile, '<!-- inject:js -->\n<!-- endinject -->');
  }
  const cssFile = path.join(__dirname, '../patternlab/_meta/css.twig');
  if (!fs.existsSync(cssFile)) {
    fs.writeFileSync(cssFile, '<!-- inject:css -->\n<!-- endinject -->');
  }
  gulp.task('pl:build', async () => {
    gulp.series('inject');
    await build(config, { cleanPublic: config.cleanPublic });
  });

  gulp.task('pl:serve', async () => {
    spawn('./node_modules/.bin/patternlab', ['serve'], {
      stdio: 'inherit',
    });
  });
};
