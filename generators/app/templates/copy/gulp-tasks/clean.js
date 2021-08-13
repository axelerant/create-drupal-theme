const del = require('del');

module.exports = (gulp) => {
  gulp.task('clean', function () {
    return del(['dist']);
  });
};
