module.exports = {
  scss: {
    source: ['patterns/**/[^_]*.scss'],
    all: ['patterns/**/*.scss'],
    destination: 'dist/css',
    options: {
      outputStyle: 'expanded',
      includePaths: ['./node_modules'],
      errLogToConsole: true,
      importer: require('node-sass-globbing'),
    },
  },
  ts: {
    source: ['patterns/**/*.ts'],
    destination: 'dist/js',
  },
  svg: {
    source: ['svg/**/*.svg'],
    destination: 'dist/svg',
  },
  images: {
    source: ['images/**/*'],
    destination: 'dist/images',
  },
  stylelint: {
    options: {
      reporters: [
        {
          formatter: 'verbose',
          console: true,
        },
      ],
      failOnError: process.env.CI === 'true',
    },
  },
};
