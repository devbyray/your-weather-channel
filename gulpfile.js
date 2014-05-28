var gulp = require('gulp');  
var sass = require('gulp-sass');  
var browserSync = require('browser-sync');


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