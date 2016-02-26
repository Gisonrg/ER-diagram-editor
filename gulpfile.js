var gulp = require('gulp');
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

var paths = {
    js: [
        'src/app/**/*.js',
        '!./src/bower_components/**'
    ],
    sass: [
        'src/sass/**/*.scss'
    ],
    html: [
        'src/app/**/*.html',
        '!./src/bower_components/**'
    ]
};

// process JS files and return the stream.
gulp.task('js', function () {

});

gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/asset/css'));
});

// inject source files
gulp.task('index', function () {
    gulp.src('./src/index.html')
        .pipe(inject(
            gulp.src(paths.js)
                .pipe(angularFilesort())
                .on('error', gutil.log),
            {relative: true}
        ))
        .pipe(gulp.dest('./src'));
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./src/"
        },
        notify: false
    });

    gulp.watch(paths.html).on('change', browserSync.reload);
    gulp.watch(paths.js, ['index', browserSync.reload]);
    gulp.watch(paths.sass, ['sass', browserSync.reload]);
});

gulp.task('default', ['sass', 'index', 'serve']);