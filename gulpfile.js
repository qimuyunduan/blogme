
'use strict';

var      gulp   = require('gulp'),
	     del    = require('del'),
      uglify    = require('gulp-uglify'),
      concat    = require('gulp-concat'),
	  minifyCss = require('gulp-minify-css'),
	minifyImage = require('gulp-imagemin'),
      watch     = require('gulp-watch'),
	browserSync = require('browser-sync').create(),
//      webpack = require('gulp-webpack');
//       config = require('./webpack.config');
           rev  = require('gulp-rev'),////- 对文件名加MD5后缀
   revCollector = require('gulp-rev-collector'),//- 路径替换
    runSequence = require('run-sequence');//Run a series of dependent gulp tasks in order




gulp.task('publish-js', function () {
    return gulp.src(['./public/js/classie.js','./public/js/main.js'])
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./public/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./public/js'));
});
gulp.task('publish-css', function () {
    return gulp.src(['./core/server/views/css/style.css','./core/server/views/css/core.css','./core/server/views/css/login.css'])
        .pipe(concat('core.min.css'))
		//.pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest('./core/server/views/css/'))
        .pipe(rev.manifest())//加上MD5后缀
        .pipe(gulp.dest('../core/server/views/css/'));
});
gulp.task('mini-css', function () {
	return gulp.src(['./core/server/views/css/print.css'])
		.pipe(minifyCss())
		.pipe(rev())
		.pipe(gulp.dest('./core/server/views/css/'))
		.pipe(rev.manifest())//加上MD5后缀
		.pipe(gulp.dest('../core/server/views/css/'));
});
gulp.task('mini-image', function () {
	return gulp.src(['./core/server/views/img/touch.png'])
		.pipe(minifyImage())
		.pipe(rev())
		.pipe(gulp.dest('./core/server/views/img/'))
		.pipe(rev.manifest())//加上MD5后缀
		.pipe(gulp.dest('../core/server/views/img/'));
});

gulp.task('clean',function() {
    del('./core/server/views/css/style-*.css','./public/js/*-*.js');
});
gulp.task('publish-html', function () {
    return gulp.src(['./public/**/*.json', './public/authorized.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./public/'));
});

gulp.task('publish', function (callback) {
    runSequence('clean',
        ['publish-css', 'publish-js'],
        'publish-html',
        callback);
});
gulp.task('browserSync', function() {
    browserSync.init({
        proxy: "localhost:8080",//8080 网站的端口
        files: "./core/server/views/*.html,./core/server/views/css/*.css",
        browser:"chrome"

    });
});
gulp.task('default',['browserSync']);
