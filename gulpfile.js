
'use strict';

var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var shrink = require('gulp-minify-css');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
//var webpack = require('gulp-webpack');
//var config = require('./webpack.config');
var rev = require('gulp-rev');////- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');//- 路径替换
var runSequence = require('run-sequence');//Run a series of dependent gulp tasks in order




gulp.task('publish-js', function () {
    return gulp.src(['./public/js/classie.js','./public/js/main.js'])
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./public/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./public/js'));
});
gulp.task('publish-css', function () {
    return gulp.src(['./core/server/views/css/app.css'])
        .pipe(shrink())
        .pipe(rev())
        .pipe(gulp.dest('./core/server/views/css/'))
        .pipe(rev.manifest())//加上MD5后缀
        .pipe(gulp.dest('../core/server/views/css'));
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
        proxy: "localhost:2368",//2368  网站的端口
        files: "./core/server/views/*.html,./core/server/views/css/*.css",
        browser:"chrome"

    });
});
gulp.task('default',['browserSync']);
