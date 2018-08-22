var gulp = require('gulp');
var historyApiFallback = require('connect-history-api-fallback')
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

gulp.task('styles', function() {
    gulp.src('app/scss/**/*.scss')
        .pipe(sass({includePaths: ['app/libs/mdi/scss/', 'app/libs/sass-mq/']}).on('error', sass.logError))
        .pipe(gulp.dest('app/scss/'))
        .pipe(browserSync.stream());
});

gulp.task('default', function() {
    browserSync.init({
        server: {
            baseDir: "./app",
            middleware: [ historyApiFallback() ]
        }
    });

    gulp.watch('app/**/*.scss', ['styles']);
    gulp.watch("app/**/*.html").on('change', browserSync.reload);
    gulp.watch("app/**/*.js").on('change', browserSync.reload);
});
