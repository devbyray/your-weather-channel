var gulp = require('gulp');  
var sass = require('gulp-sass');  
var browserSync = require('browser-sync');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gutil = require('gulp-util');

gulp.task('clean', function () {  
  return gulp.src('build', {read: false})
    .pipe(clean());
});

gulp.task('vendor', function() {  
  return gulp.src('js/vendor/*.js')
    .pipe(concat('js/vendor.js'))
    .pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .on('error', gutil.log)
});

gulp.task('css', function() {  
  return gulp.src('css/*.css')
    .pipe(concat('css/build.css'))
    .pipe(gulp.dest('build'))
    .on('error', gutil.log)
});

gulp.task('html', function() {  
  return gulp.src('*.html')
    .pipe(gulp.dest('build'))
    .on('error', gutil.log)
});


gulp.task('sass', function () {  
    gulp.src('scss/screen.scss')
        .pipe(sass({includePaths: ['scss']}))
        .pipe(gulp.dest('css'));
});

// Reload all browsers
gulp.task('browser-sync', function() {  
    browserSync.init(["css/*.css", "js/*.js"], {
        server: {
            baseDir: "./"
        }
    });
});

// Reload all Browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['sass', 'browser-sync'], function () {  
    gulp.watch("scss/*.scss", ['sass']);
    gulp.watch("*.html", ['bs-reload']);
    gulp.watch("*.js", ['bs-reload']);
    gulp.watch("js/*.js", ['bs-reload']);
    gulp.watch("js/*/*.js", ['bs-reload']);
});

gulp.task('build', ['clean', 'vendor', 'css'], function () {  
});