const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const order = require('gulp-order');
const uglify = require('gulp-terser');
const cleanCSS = require('gulp-clean-css');
const cssmin = require('gulp-cssmin');
const obfuscator = require('gulp-javascript-obfuscator');
const sourcemaps = require('gulp-sourcemaps');

/**
 * DEV JS
 */
gulp.task('build-dev', function () {
    return gulp.src(['js/imports/*.js', 'js/core/*.js', 'js/reporting/*.js', 'js/criterias/*.js',
        'js/modules/*.js', 'js/locales/*.js', 'js/templates/*.js', 'js/bootstrap/*.js'])
        .pipe(order([
            'js/imports/*.js',
            'js/core/*.js',
            'js/reporting/*.js',
            'js/criterias/*.js',
            'js/modules/*.js',
            'js/locales/*.js',
            'js/templates/*.js',
            'js/bootstrap/*.js',
        ], { base: __dirname }))
        .pipe(concat('metadocx.js'))
        .pipe(gulp.dest('dist'));

});

/**
 * DEV CSS
 */
gulp.task('build-dev-css', function () {
    return gulp.src(['css/**/*.css'])
        .pipe(order([
            'css/**/*.css',
        ], { base: __dirname }))
        .pipe(concat('metadocx.css'))
        .pipe(gulp.dest('dist'));

});

/**
 * min JS
 */
gulp.task('build-prod', function () {
    return gulp
        .src(['js/imports/*.js', 'js/core/*.js', 'js/reporting/*.js',
            'js/criterias/*.js', 'js/modules/*.js', 'js/locales/*.js',
            'js/templates/*.js', 'js/bootstrap/*.js'])
        .pipe(order([
            'js/imports/*.js',
            'js/core/*.js',
            'js/reporting/*.js',
            'js/criterias/*.js',
            'js/modules/*.js',
            'js/locales/*.js',
            'js/templates/*.js',
            'js/bootstrap/*.js',
        ], { base: __dirname }))
        .pipe(concat('metadocx.min.js'))
        .pipe(minify({
            ext: {
                src: '.js',
                min: '.js'
            }
        }
        ))
        .pipe(sourcemaps.init())
        .pipe(obfuscator({
            compact: true
        }))
        .pipe(sourcemaps.write('maps/'))
        .pipe(gulp.dest('dist'));

});



/**
 * CSS Production (min)
 */
gulp.task('build-prod-css', function () {
    return gulp
        .src(['css/**/*.css'])
        .pipe(concat('metadocx.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('dist'));

});  
