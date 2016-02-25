var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

// process JS files and return the stream.
gulp.task('js', function () {

});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', browserSync.reload);

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['js'], function () {

    browserSync.init({
        server: {
            baseDir: "./app/"
        },
        notify: false
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("app/**/*.js", ['js-watch']);
});

gulp.task('default', ['serve']);