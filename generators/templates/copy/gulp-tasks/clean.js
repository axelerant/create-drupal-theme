import {deleteAsync} from 'del';

export default (gulp) => {
  gulp.task('clean', function () {
    return deleteAsync(['dist']);
  });
};
