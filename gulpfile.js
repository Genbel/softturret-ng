/*
* Dependencies
*/
var gulp = require('gulp'),
    // Minimimize JS files
    uglify = require('gulp-uglify'),
    // Validate js files
    jshint = require('gulp-jshint'),
    // Minimize css file
    minify_css = require('gulp-minify-css');

/*
* Configuration of the task
*/
gulp.task('run', function () {
  gulp.src('./public/app.js')
  .pipe(jshint())
});