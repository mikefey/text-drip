const gulp = require('gulp');
const gulpJspm = require('gulp-jspm');
const sass = require('gulp-sass');
const react = require('gulp-react');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const htmlReplace = require('gulp-html-replace');
const run = require('gulp-run');

gulp.task('transpile', function () {
  return gulp.src(['assets/js/src/**/*.js', 'assets/js/src/**/*.jsx'])
    .pipe(react({ harmony: false, es6module: true }))
    .pipe(gulp.dest('assets/js/build'));
});

gulp.task('bundle', ['jsx'], function () {
  return gulp.src('assets/js/build/main.js')
    .pipe(sourcemaps.init())
    .pipe(gulpJspm({ selfExecutingBundle: true, minify: true, mangle: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/js/build'));
});

gulp.task('setupindexforprod', ['bundle'], function () {
  return gulp.src('index.html')
    .pipe(htmlReplace({ 'js': '<!-- build:js -->\n\t\t<script src=\'assets/js/build/main.bundle.js\'></script>\n\t\t<!-- endbuild -->' }))
    .pipe(gulp.dest('.'));
});

gulp.task('prepdeploy', ['setupindexforprod'], function () {
  run('rm -r assets/js/build/components assets/js/build/constants assets/js/build/data assets/js/build/dispatcher assets/js/build/helpers assets/js/build/stores assets/js/build/main.js').exec();
});

gulp.task('prepdev', function () {
  return gulp.src('index.html')
    .pipe(htmlReplace({ 'js': '<!-- build:js -->\n\    <script src=\'jspm_packages/system.js\'></script>\n\    <script src=\'config.js\'></script>\n\    <script>System.import(\'assets/js/src/main.js\');</script>\n\    <!-- endbuild -->' }))
    .pipe(gulp.dest('.'));
});

gulp.task('compilecss', function () {
  return gulp.src('assets/css/src/main.scss')
    .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('assets/css/build'));
});

gulp.task('watch', function () {
  gulp.watch('assets/js/src/**/*.js', ['bundle']);
  gulp.watch('assets/css/src/**/*.scss', ['compilecss']);
});

gulp.task('watchcss', function () {
  gulp.watch('assets/css/src/**/*.scss', ['compilecss']);
});
