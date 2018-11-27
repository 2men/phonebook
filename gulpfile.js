'use strict';

var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var pug = require('gulp-pug');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');

var srcAssets = './src/assets';
var dest = './build';

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: dest
        }
    });

    browserSync.watch(dest + `/**/*.*`).on('change', browserSync.reload);
});

gulp.task('styl', function () {
  return gulp.src('./src/styl/*.styl')
    .pipe(stylus())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest(srcAssets + '/css/'));
});

gulp.task('views', function () {
    return gulp.src('./src/*.pug')
    .pipe(pug({ pretty: '\t' }))
    .pipe(gulp.dest(dest));
});

gulp.task('assets', function () {
    return gulp.src(srcAssets + '/**')
    .pipe(gulp.dest(dest + '/assets'));
});

gulp.task('cssmin', function () {
    gulp.src(srcAssets + '/css/**/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest(srcAssets + '/css'));
});

gulp.task('uglify', function () {
    gulp.src(srcAssets + '/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(srcAssets + '/js'));
});

gulp.task('build', gulp.series('styl', 'views', 'assets'));

gulp.task('watch', function () {
    gulp.watch('./src/styl/*.styl', gulp.series('styl'));
    gulp.watch('./src/**/*.pug', gulp.series('views'));
    gulp.watch(srcAssets + '/**', gulp.series('assets'));
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));

gulp.task('prod', gulp.series('cssmin', 'uglify', 'assets'));
