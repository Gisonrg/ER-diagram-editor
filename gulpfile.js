var gulp = require('gulp');
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var del = require('del');
var runSequence = require('run-sequence');
var ghPages = require('gulp-gh-pages');

var paths = {
	js: [
		'src/app/**/*.js',
		'!./src/bower_components/**'
	],
	sass: [
		'src/sass/**/*.scss'
	],
	images: [
		'src/asset/img/**/*'
	],
	html: [
		'src/app/**/*.html',
		'!./src/bower_components/**'
	],
	vendorJs: [
		'src/bower_components/jquery/dist/jquery.min.js',
		'src/bower_components/jquery-ui/jquery-ui.min.js',
		'src/bower_components/angular/angular.min.js',
		'src/bower_components/angular-dragdrop/src/angular-dragdrop.js',
		'src/bower_components/bootstrap/dist/js/bootstrap.min.js',
		'src/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
		'src/bower_components/angular-strap/dist/angular-strap.min.js',
		'src/bower_components/angular-bootstrap-contextmenu/contextMenu.js',
		'src/bower_components/json-formatter/dist/json-formatter.min.js'
	],
	vendorStyle: [
		'src/bower_components/bootstrap/dist/css/bootstrap.min.css',
		'src/bower_components/json-formatter/dist/json-formatter.min.css'
	],
	vendorDistJs: [
		'dist/asset/js/jquery.min.js',
		'dist/asset/js/jquery-ui.min.js',
		'dist/asset/js/angular.min.js',
		'dist/asset/js/angular-dragdrop.js',
		'dist/asset/js/bootstrap.min.js',
		'dist/asset/js/ui-bootstrap-tpls.min.js',
		'dist/asset/js/angular-strap.min.js',
		'dist/asset/js/contextMenu.js',
		'dist/asset/js/json-formatter.min.js'
	],
};

gulp.task('sass', function () {
	return gulp.src(paths.sass)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('src/asset/css'));
});

// inject source files
gulp.task('index', function () {
	var target = gulp.src('./src/index.html');
	return target
		.pipe(inject(
			gulp.src(paths.vendorJs, {read: false}),
			{relative: true, name: 'vendor'}
		))
		.pipe(inject(
			gulp.src(paths.vendorStyle, {read: false}),
			{relative: true, name: 'vendor'}
		))
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

gulp.task('dist:clean', function () {
	return del(['dist/**/*.*']);
});

gulp.task('dist:js', ['dist:clean'], function () {
	return gulp.src(paths.js)
		.pipe(gulp.dest('dist/app'));
});

gulp.task('dist:sass', function () {
	return gulp.src(paths.sass)
		.pipe(sass().on('error', sass.logError))
		.pipe(minifyCSS())
		.pipe(concat('main.css'))
		.pipe(gulp.dest('dist/asset/css'));
});

gulp.task('dist:template', function () {
	return gulp.src(paths.html)
		.pipe(gulp.dest('dist/app'));
});

gulp.task('dist:images', function () {
	return gulp.src(paths.images)
		.pipe(gulp.dest('dist/asset/img'));
});

gulp.task('dist:vendor', ['dist:vendor-js', 'dist:vendor-style']);

gulp.task('dist:vendor-js', function () {
	return gulp.src(paths.vendorJs)
		.pipe(gulp.dest('dist/asset/js'));
});

gulp.task('dist:vendor-style', function () {
	return gulp.src(paths.vendorStyle)
		.pipe(concat('vendor.css'))
		.pipe(gulp.dest('dist/asset/css'));
});

gulp.task('dist:index-copy', function () {
	return gulp.src('./src/index.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('dist:index-all', function () {
	return gulp.src('./dist/index.html')
		.pipe(inject(
			gulp.src(paths.vendorDistJs),
				{relative: true, name: 'vendor'}
		))
		.pipe(inject(
			gulp.src('dist/asset/css/vendor.css', {read: false}),
				{relative: true, name: 'vendor'}
		))
		.pipe(inject(
			gulp.src('dist/app/**/*.js')
				.pipe(angularFilesort())
				.on('error', gutil.log),
			{relative: true}
		))
		.pipe(gulp.dest('./dist'));
});

gulp.task('dist:serve', function () {
	browserSync.init({
		server: {
			baseDir: "./dist/"
		},
		notify: false
	});
});

gulp.task('dist:index', function() {
	runSequence(
		'dist:index-copy', 'dist:index-all'
	);
});

gulp.task('default', function() {
	runSequence('sass', 'index', 'serve');
});
gulp.task('dist', function () {
	runSequence(
		'dist:clean',
		['dist:js', 'dist:sass', 'dist:template', 'dist:images'],
		'dist:vendor',
		'dist:index',
		'dist:serve'
	);
});

gulp.task('deploy', function() {
	return gulp.src('./dist/**/*')
		.pipe(ghPages());
});