var gulp = require('gulp');
var browserify = require('browserify');
var compass = require('gulp-compass');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var ejs = require('browserify-ejs');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var cp = require('child_process');

// Basic usage
gulp.task('scripts:folders', function(done) {
  // Make sure the scripts folder exists. Browserify won't create it itself.
  var args = ['-p', 'assets/scripts'];

  return cp.spawn('mkdir', args, {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('scripts:build', function(done) {
  var args = ['node_modules/.bin/browserify', 'source_assets/scripts/app.js',
    '-d', '-o', 'assets/scripts/app.js',
    '-t', 'browserify-ejs',
    '-t', 'rfolderify'];

  return cp.spawn('node', args, {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('scripts:lint', function() {
  return gulp.src('./source_assets/scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('compass', function() {
  return gulp.src('source_assets/styles/*.scss')
    .pipe(compass({
      css: 'assets/styles',
      sass: 'source_assets/styles',
      style: 'expanded',
      sourcemap: true,
      require: ["sass-css-importer"],
      bundle_exec: true
    }));
});

// Copy source PNGs to the asset folder.
gulp.task('images:copy', function() {
  return gulp.src('source_assets/images/*.png')
    .pipe(gulp.dest('assets/images'));
});

// Setup browserSync.
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "."
    }
  });
});

gulp.task('scripts', function(done) {
  runSequence('scripts:folders', 'scripts:lint', 'scripts:build', done);
});

// Main build task.
gulp.task('build', function(done) {
  runSequence(['scripts', 'images:copy', 'compass'], done);
});

gulp.task('watch', function() {
  gulp.watch('source_assets/styles/**/*.scss', function() {
    runSequence('compass', browserReload);
  });

  gulp.watch(['source_assets/scripts/**/*.js', 'source_assets/scripts/**/*.html'], function() {
    runSequence('scripts', browserReload);
  });
});

// Default task.
// Builds the website, watches for changes and starts browserSync.
gulp.task('default', function(done) {
  runSequence('build', 'watch', 'browser-sync', done);
});

var shouldReload = true;
gulp.task('no-reload', function(done) {
  shouldReload = false;
  runSequence('build', 'watch', 'browser-sync', done);
});

////////////////////////////////////////////////////////////////////////////////
//------------------------- Helper functions ---------------------------------//
//----------------------------------------------------------------------------//

function browserReload() {
  if (shouldReload) {
    browserSync.reload();
  }
}
