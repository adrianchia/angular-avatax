'use strict';

var path = require('path');
var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var del = require('del');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var eslint = require('gulp-eslint');

gulp.task('clean', function() {
  del(['coverage','dist']);
});

gulp.task('test', function(done) {
  const child_process = require('child_process');
  child_process.exec('./node_modules/.bin/karma start karma.conf.js', (err, stdout) => {
    gutil.log(stdout);

    if(err) {
      throw new Error(err);
    } else {
      done();
    }
  });
});

gulp.task('lint', function() {
  return gulp.src('src/angular-avatax.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('build', ['clean', 'lint', 'test'], function() {
  return gulp.src('src/angular-avatax.js')
    .pipe(ngAnnotate())
    .pipe(gulp.dest('dist'))
    .pipe(rename('angular-avatax.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
