import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { spawn } from 'child_process';
import build from '@pattern-lab/cli/bin/build.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const config = require('../patternlab-config.json');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (gulp) => {
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
