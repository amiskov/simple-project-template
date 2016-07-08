var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    prefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync'),
    php = require('gulp-connect-php');

gulp.task('move', function () {
    gulp.src('./src/*.php', {base: './src'})
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('style', function () {
    return gulp.src('./src/less/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(prefixer())
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('server', function() {
    php.server({
        base: './build'
    }, function (){
        browserSync({
            proxy: '127.0.0.1:8000',
            baseDir: 'build',
            directory: true
        });
    });

    gulp.watch('src/*.php').on('change', function () {
        browserSync.reload();
    });
});

gulp.task('watch', function () {
    watch(['src/less/**/*.less'], function () {
        gulp.start('style');
    });

    watch(['src/index.php'], function () {
        gulp.start('move');
    });
});

// Default task
gulp.task('default', ['move', 'style', 'server', 'watch']);
