const gulp = require('gulp');

const config = require('./gulp-tasks/config');

const tasks = [
  'scss',
  'ts',
  'svg',
  'prettier',
  'lint',
  'images',
  <%- pl.plTask %>
  'watch',
  'default',
];

tasks.forEach((task) => {
  const t = require(`./gulp-tasks/${task}`);
  t(gulp, config);
});
