'use strict';
var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('default', ['watch']);

gulp.task('watch', function() {
  return gulp.watch('app/scripts/*', ['build']);
});

gulp.task('build', function() {
  return gulp
    .src('app/scripts/*')
    .pipe(browserify())
    .pipe(gulp.dest('app/build/scripts'));
});
