const gulp = require('gulp');

const config = require('./gulp-tasks/config');

const tasks = [
  'scss',
  'ts',
  'svg',
  'prettier',
  'lint',
  'watch',
  'images',
  'default',
];

tasks.forEach((task) => {
  const t = require(`./gulp-tasks/${task}`);
  t(gulp, config);
});
