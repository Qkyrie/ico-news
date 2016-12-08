'use strict';

/* do NOT change the order of the pipes as this could cause unwanted effects */
var pkg = require('./package.json'),
	del = require('del'),
	gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	bless = require('gulp-bless'),
	cached = require('gulp-cached'),
	concat = require('gulp-concat'),
	copy = require('gulp-copy'),
	eslint = require('gulp-eslint'),
	htmllint = require('gulp-htmllint'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),
	uglify = require('gulp-uglify'),
	gUtil = require('gulp-util'),
	fileExists = require('file-exists'),
	rename = require('gulp-rename'),
	gutil = require('gulp-util'),
	fs = require('fs');

var paths = {
   scripts: ["node_modules/bootstrap/dist/js/bootstrap.min.js"],
   css: ["node_modules/bootstrap/dist/css/bootstrap.min.css"],
   img: ["img/*"],
   fonts: ["node_modules/bootstrap/dist/fonts/*"]
  };

// helper functions
function onError(err) {
	gUtil.log('\n', gUtil.colors.bold(gUtil.colors.red('Error ocurred: ') + err.message + ' @ ' + err.fileName + ':' + err.lineNumber), '\n');
	gUtil.beep();
	this.emit('end');
}

function getArgument(key) {
	return gUtil.env[key] ? gUtil.env[key] : null;
}

// clean folders
gulp.task('clean', function() {
	pkg.clean.forEach(function(path) {
		return del.sync(path, {
			'force': true
		});
	});
});

//  Images
gulp.task('imgbuild', function() {
	return gulp
  	.src(paths.img)
  	.pipe(gulp.dest('../WEB-INF/static/img/'))
		.pipe(notify({
			'message': 'IMG build complete',
			'onLast': true // otherwise the notify will be fired for each file in the pipe
		}));
});

// Javascript
gulp.task('eslint', function() {
	return gulp.src(pkg.js.hint.src)
		.pipe(plumber({
			'errorHandler': onError
		}))
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('js', ['eslint'], function() {
	gulp.start('jsbuild');
});

gulp.task('jsbuild', function() {
  return gulp
  	.src(paths.scripts)
  	.pipe(gulp.dest('../WEB-INF/static/js/'));
});

// CSS
gulp.task('cssbuild', function() {
	return gulp
    	.src(paths.css)
    	.pipe(gulp.dest('../WEB-INF/static/css/'));
});

//FONTS
gulp.task('fontbuild', function() {
	return gulp
    	.src(paths.fonts)
    	.pipe(gulp.dest('../WEB-INF/static/fonts/'));
});

// copy src html to static
gulp.task('buildhtml', ['clean'], function() {
	return gulp.src('html/*.html')
		.pipe(gulp.dest('../WEB-INF/static/html/'))
		.pipe(notify({
			'message': 'HTML: build complete',
			'onLast': true // otherwise the notify will be fired for each file in the pipe
		}));
});

// html
gulp.task('htmllint', function() {
	return gulp.src(pkg.html.hint.src)
		.pipe(htmllint());
});

// build all task
gulp.task('build', ['clean'], function() {
	// pay attention when upgrading gulp: https://github.com/gulpjs/gulp/issues/505#issuecomment-45379280
	gulp.start('imgbuild');
	gulp.start('fontbuild');
	gulp.start('jsbuild');
	gulp.start('cssbuild');
});

// default task
gulp.task('default', ['clean'], function() {
	// pay attention when upgrading gulp: https://github.com/gulpjs/gulp/issues/505#issuecomment-45379280
	gulp.start('imgbuild');
	gulp.start('fontsbuild');
	gulp.start('js');
	gulp.start('sass');

	// watch
	gulp.watch(pkg.img.watch, ['imgbuild']);
	gulp.watch(pkg.fonts.watch, ['fontsbuild']);
	gulp.watch(pkg.js.watch, ['js']);
	gulp.watch(pkg.sass.watch, ['sass']);
});

// deploy task
gulp.task('deploy', function() {
	// pay attention when upgrading gulp: https://github.com/gulpjs/gulp/issues/505#issuecomment-45379280
	gulp.start('imgbuild');
	gulp.start('fontsbuild');
	gulp.start('jsbuild');
	gulp.start('sassbuild');
});
