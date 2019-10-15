var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var browserSync = require('browser-sync');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var svgstore = require('gulp-svgstore');
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');
 
gulp.task('styles', function () {
    return gulp
        .src('source/sass/main.scss')
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(gulp.dest('source/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('css-libs', function() {
    return gulp.src('source/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('source/css'));
}); 

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'source'
        },
        notify: false
    });
});

gulp.task('scripts', function() {
    return gulp.src(['source/js/common.js', 'source/libs/**/*.js'])
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
    return gulp.src('source/*.html')
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('watch', function() {
    gulp.watch('source/sass/**/*.scss', gulp.parallel('styles'));
    gulp.watch('source/*.html', browserSync.reload);
    gulp.watch('source/js/common.js', browserSync.reload);
    gulp.watch('source/libs/**/*.js', browserSync.reload);
});
gulp.task('start', gulp.parallel('styles', 'browser-sync', 'watch'));

gulp.task('compress', function() {
    return gulp.src('source/img/*')
    .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.jpegtran({progressive: true}),
        imagemin.svgo()
    ]))
    .pipe(gulp.dest('source/img'));
});

gulp.task('webp', function() {
    return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest('source/img'));
});

gulp.task('sprite', function() {
    return gulp.src('source/img/icon-*.svg')
        .pipe(svgstore({
            inlineSvg: true
    }))
        .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('source/img'));
});

gulp.task('html', function() {
    return gulp.src('source/*.html')
    .pipe(posthtml([
        include()
    ]))
    .pipe(gulp.dest('source'))
});