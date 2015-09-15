var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var imagemin = require('gulp-imagemin');
var spritesmith = require('gulp.spritesmith');
var util = require('gulp-util');
var del = require('del');

gulp.task('clean', function () {
    del(['./app/styles/tmp/**/*']);
});

gulp.task('sass', ['sprites'], function () {
    del(['./app/styles/tmp/scss.css']); // clear output file
    return gulp
        .src([
            './app/components/Materialize/bin/materialize.css',
            './app/styles/global.scss'
        ])
        .pipe(sass({
            style: 'compressed'
        }))
        .pipe(concat('scss.css'))
        .pipe(gulp.dest('./app/styles/tmp'));
});

gulp.task('sprites', function () {
    del(['./app/styles/tmp/sprites.css']); // clear output file
    var spriteData = gulp.src('./app/sprites/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprites.css',
        padding: 5,
        imgPath: '../img/sprite.png'
    }));
    spriteData.img.pipe(imagemin()).pipe(gulp.dest('./public/img/'));
    return spriteData.css.pipe(gulp.dest('./app/styles/tmp'));
});

gulp.task('css', ['sass'], function () {
    return gulp.src(
        [
            './app/components/normalize.css/typerace.css',
            './app/styles/tmp/*.css'
        ]
    )
        .pipe(concat('typerace.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('js', function () {
    return gulp.src(
        [
            // LIBRARIES AND FRAMEWORKS
            './app/components/jquery/dist/jquery.js',
            './app/components/moment/moment.js',
            './app/components/angular/angular.js',
            './app/components/Materialize/bin/materialize.js',

            // BOOT
            './app/scripts/boot.js',

            // ANGULAR COMPONENTS
            './app/components/angular-resource/angular-resource.js',
            './app/components/angular-translate/angular-translate.js',
            './app/components/angular-sanitize/angular-sanitize.js',
            './app/components/angular-ui-router/release/angular-ui-router.js',
            './app/components/angular-moment/angular-moment.min.js',

            // ANGULAR LOGIC
            './app/scripts/app.js',
            './app/scripts/routes.js',
            './app/scripts/**/*.js',
            './app/scripts/*.js',

            // VENDOR SCRIPTS
            './app/components/cookieconsent2/cookieconsent.js'
        ]
    )
        .pipe(concat('typerace.js'))
        .pipe(gulp.dest('./public/js')) // Uncomment to add non-ugly output.
        .pipe(rename('typerace.min.js'))
        // .pipe(ngmin()) // VERY heavy angular-safe compression. If ran, it should be possible to enable mangling in uglify(). REQUIRES EXTENSIVE TESTING AFTERWARDS.
        .pipe(uglify({mangle: false}).on('error', util.log))
        .pipe(gulp.dest('./public/js'));
});

// Run tasks
gulp.task('default', ['js', 'css'], function () {
    console.log('Build complete!');
});

gulp.task('watch', ['default'], function () {
    gulp.watch('./app/styles/**', ['css']);
    gulp.watch('./app/scripts/**', ['js']);
});