import gulp from 'gulp';
import config from './gulp-tasks/config.js';

import clean from './gulp-tasks/clean.js';
import scss from './gulp-tasks/scss.js';
import ts from './gulp-tasks/ts.js'
import svg from './gulp-tasks/svg.js';
import pretty from './gulp-tasks/prettier.js';
import lint from './gulp-tasks/lint.js';
import images from './gulp-tasks/images.js';
<%- ds.dsImport %>
import defaulttask from './gulp-tasks/default.js';
import watch from './gulp-tasks/watch.js';

clean(gulp, config);
scss(gulp, config);
ts(gulp, config);
svg(gulp, config);
pretty(gulp, config);
lint(gulp, config);
images(gulp, config);
<%- ds.dsTask %>
defaulttask(gulp, config);
watch(gulp, config);
