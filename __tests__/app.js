'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('create-drupal-theme', () => {
  beforeAll(() =>
    helpers
      .run(path.join(__dirname, '../generators'))
      .withPrompts({ someAnswer: true }),
  );

  it('creates files', () => {
    assert.file(['dummyfile.txt']);
  });
});
