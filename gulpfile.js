var gulp = require('gulp');
var browserify = require('gulp-browserify');
var compass = require('gulp-compass');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
 
// Basic usage 
gulp.task('scripts', function() {
  // Single entry point to browserify 
  return gulp.src('source_assets/scripts/app.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : true
    }))
    .pipe(gulp.dest('assets/scripts'))
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

// Setup browserSync.
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "."
    }
  });
});

// Main build task
gulp.task('build', function(done) {
  runSequence(['scripts', 'compass'], done);
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