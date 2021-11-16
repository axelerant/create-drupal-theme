#!/usr/bin/env node

const yeoman = require('yeoman-environment');
const env = yeoman.createEnv();

env.register(require.resolve('../generators/index.js'), 'create-drupal-theme');
env.run('create-drupal-theme');
