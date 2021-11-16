const gulp = require('gulp');

const config = require('./gulp-tasks/config');

const tasks = [
  'clean',
  'scss',
  'ts',
  'svg',
  'prettier',
  'lint',
  'images',<%- ds.dsTask %>
  'default',
  'watch',
];

tasks.forEach((task) => {
  const t = require(`./gulp-tasks/${task}`);
  t(gulp, config);
});
