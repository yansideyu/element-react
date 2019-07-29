'use strict';

var gulp = require('gulp');
var postcss = require('gulp-postcss');
var cssmin = require('gulp-cssmin');
var salad = require('postcss-salad')(require('./salad.config.json'));

gulp.task('compile', function() {
  return gulp.src('./styles/*.css')
    .pipe(postcss([salad]))
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/npm/es5/styles'))
    .pipe(gulp.dest('./dist/npm/es6/styles'));
});

gulp.task('copyfont', function() {
  return gulp.src('./styles/fonts/**')
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/npm/es5/styles/fonts'))
    .pipe(gulp.dest('./dist/npm/es6/styles/fonts'));
});

gulp.task('build', ['compile', 'copyfont']);
