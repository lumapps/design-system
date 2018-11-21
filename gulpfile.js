var gulp = require('gulp');
var historyApiFallback = require('connect-history-api-fallback')
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

gulp.task('styles', function() {
    gulp.src('scss/**/*.scss')
        .pipe(sass({includePaths: ['node_modules/sass-mq/']}).on('error', sass.logError))
        .pipe(gulp.dest('scss/'))
        .pipe(browserSync.stream());
});

gulp.task('default', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            middleware: [ historyApiFallback() ]
        }
    });

    gulp.watch(['components/**/*.scss', 'core/scss/lumx.scss', 'layout/**/*.scss', 'scss/app.scss'], ['styles']);
    gulp.watch(['components/**/*.html', 'demo/**/*.html', 'layout/**/*.html']).on('change', browserSync.reload);
    gulp.watch(['components/**/*.js', 'core/**/*.js', 'demo/**/*.js']).on('change', browserSync.reload);
});
