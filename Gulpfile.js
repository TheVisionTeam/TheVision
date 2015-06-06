var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    //imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    coffee = require('gulp-coffee'),
    slim = require('gulp-slim'),
    del = require('del'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    NWBuilder = require('node-webkit-builder');

gulp.task('default', function() {
    gulp.run("libs");
    gulp.run("generate");
    gulp.run("watch");
    gulp.run("server");
    gulp.run("open");
});

// Basic Assets Generate Functions =========================

gulp.task('scss', function() {
  gulp.src('src/stylesheets/*.scss')
    .pipe(autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
    .pipe(sass({ precision: 30, style: 'expanded' }))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/assets/css'))
    .pipe(notify({ message: 'Stylesheets task complete!' }));
});
gulp.task('css', function() {
  gulp.src('src/stylesheets/*.css')
    .pipe(gulp.dest('public/assets/css'))
    .pipe(notify({ message: 'CSS Stylesheets task complete!' }));
});

gulp.task('coffee', function() {
  gulp.src('./src/javascripts/*.coffee')
    .pipe(coffee({bare: true}).on('error', console.log))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('application.js'))
    .pipe(gulp.dest('public/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('js', function() {
  gulp.src('./src/javascripts/*.js')
    .pipe(gulp.dest('public/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('slim', function () {
  gulp.src('./src/views/*.slim')
    .pipe(slim({pretty: true, options: "encoding='utf-8'"}))
    .pipe(gulp.dest('public/'))
    .pipe(notify({ message: 'Slim task complete' }));
})

gulp.task('image', function() {
  gulp.src('./src/images/**')
    .pipe(gulp.dest('public/assets/images'))
    .pipe(notify({ message: 'Images task complete' }));
})
// Basic Functions Done ==================================

// Libs Copy ========================================
var libs = {
    js: [
        "vendor/assets/jquery/dist/jquery.min.js",
        "vendor/assets/angular/angular.min.js",
        "vendor/assets/angular-route/angular-route.min.js",
        "vendor/assets/underscore/underscore-min.js",
        "vendor/assets/modernizr/modernizr.js",
        "vendor/assets/angular-sanitize/angular-sanitize.min.js"
    ],
    css: [
    ],
    font: [
        //"vendor/fonts/**"
    ]
};

gulp.task("libs", function() {
  gulp.src(libs.js)
    //.pipe(gulp.dest('public/assets/js'))
    //.pipe(rename({suffix: '.min'}))
    //.pipe(uglify())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('public/assets/js'))
    .pipe(notify({ message: 'Libs-Scripts task complete' }));

  gulp.src(libs.css)
    .pipe(gulp.dest('public/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/assets/css'))
    .pipe(notify({ message: 'Libs-Stylesheets task complete!' }));

  gulp.src(libs.font)
    .pipe(gulp.dest('public/assets/fonts'))
    .pipe(notify({ message: 'Libs-Fonts task complete!' }));
});

gulp.task("data", function() {
  gulp.src('src/data/*.*')
    .pipe(gulp.dest('public/data'))
    .pipe(notify({ message: 'JSON Data Updated!' }));
});

// Libs Done ============================================

// Start a Assets Server ============================
gulp.task('server', [ 'generate' ], function() {
    return connect.server({
        root: [ 'public' ],
        livereload: true
    });
});

gulp.task('open', function () {
    return gulp.src('public/index.html').pipe(open('', { url: 'http://localhost:8080' }));
});

gulp.task('build', ['generate'], function() {
    var nw = NWBuilder({
        files: 'public/**',
        platforms: ['osx']
    });
});
// Server Doen ======================================

gulp.task('generate', ['image', 'scss', 'css', 'coffee', 'js', 'slim', 'data'])
gulp.task('clean', function(cb) {
    del(['public/assets/css/*.css', 'public/assets/css/*.map', 'public/assets/js'], cb)
});
gulp.task('reload', ['clean', 'default'])

gulp.task('watch', function() {

    livereload.listen();
    gulp.watch(['src/**']).on('change', livereload.changed);

    gulp.watch('src/images/*.*', ['image']);
    gulp.watch('src/data/*.*', ['data']);

    // Watch .scss files/
    gulp.watch('src/stylesheets/*.scss', ['scss']);
    gulp.watch('src/stylesheets/*.css', ['css']);

    // Watch .coffee files
    gulp.watch('src/javascripts/*.coffee', ['coffee']);

    // Watch .js files
    gulp.watch('src/javascripts/*.js', ['js']);

    // Watch .slim files
    gulp.watch('src/views/*.slim', ['slim']);

});