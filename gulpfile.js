var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var cssmin = require("gulp-cssmin");
var imagemin = require("gulp-imagemin");
var spritesmith = require("gulp.spritesmith");
var util = require("gulp-util");
var del = require("del");
var eslint = require("gulp-eslint");
var mocha = require("gulp-mocha");

function swallowError(error) {
    console.log(error.toString());
    this.emit("end");
}

gulp.task("clean", function () {
    del(["./app/styles/tmp/**/*"]);
});

gulp.task("sass", ["sprites"], function () {
    del(["./app/styles/tmp/scss.css"]); // clear output file
    return gulp
        .src([
            "./app/styles/global.scss",
        ])
        .pipe(sass({style: "compressed"}))
        .on("error", swallowError)
        .pipe(concat("scss.css"))
        .on("error", swallowError)
        .pipe(gulp.dest("./app/styles/tmp"));
});

gulp.task("sprites", function () {
    var spriteData;
    del(["./app/styles/tmp/sprites.css"]); // clear output file
    spriteData = gulp.src("./app/sprites/*.png")
        .pipe(spritesmith({
            imgName: "sprite.png",
            cssName: "sprites.css",
            padding: 5,
            imgPath: "../img/sprite.png",
        }))
        .on("error", swallowError);

    spriteData.img
        .pipe(imagemin())
        .on("error", swallowError)
        .pipe(gulp.dest("./public/img/"));

    return spriteData.css.pipe(gulp.dest("./app/styles/tmp"));
});

gulp.task("css", ["sass"], function () {
    return gulp.src(
        [
            "./app/components/pure/base-min.css",
            "./app/components/normalize.css",
            "./app/components/pure/grids-min.css",
            "./app/components/pure/grids-responsive-min.css",
            "./app/styles/tmp/*.css",
        ]
    )
        .pipe(concat("typerace.min.css"))
        .on("error", swallowError)
        .pipe(cssmin())
        .on("error", swallowError)
        .pipe(gulp.dest("./public/css"));
});

gulp.task("lint", function () {
    return gulp
        .src([
            // app
            "./app/scripts/**/*.js",
            "./app/scripts/*.js",
            "./app/*.js",

            // api
            "./api/controllers/*.js",
            "./api/models/*.js",
            "./api/*.js",

            // tests
            "./tests/**/*.js",
        ])
        .pipe(eslint())
        .on("error", swallowError)
        .pipe(eslint.format())
        .on("error", swallowError);
});

gulp.task("js", ["lint"], function () {
    return gulp
        .src([
            // LIBRARIES AND FRAMEWORKS
            "./app/components/jquery/dist/jquery.js",
            "./app/components/moment/moment.js",
            "./app/components/angular/angular.js",

            // BOOT
            "./app/scripts/boot.js",

            // ANGULAR COMPONENTS
            "./app/components/angular-resource/angular-resource.js",
            "./app/components/angular-translate/angular-translate.js",
            "./app/components/angular-sanitize/angular-sanitize.js",
            "./app/components/angular-ui-router/release/angular-ui-router.js",
            "./app/components/angular-moment/angular-moment.min.js",

            // ANGULAR LOGIC
            "./app/scripts/boot.js",
            "./app/scripts/app.js",
            "./app/scripts/factories/*.js",
            "./app/scripts/services/*.js",
            "./app/scripts/routes.js",
            "./app/scripts/**/*.js",
            "./app/scripts/*.js",

            // VENDOR SCRIPTS
            "./app/components/cookieconsent2/cookieconsent.js",
        ])
        .pipe(concat("typerace.js"))
        .on("error", swallowError)
        .pipe(gulp.dest("./public/js")) // Uncomment to add non-ugly output.
        .pipe(rename("typerace.min.js"))
        // .pipe(ngmin()) // VERY heavy angular-safe compression. If ran, it should be possible to enable mangling in uglify(). REQUIRES EXTENSIVE TESTING AFTERWARDS.
        .pipe(uglify({mangle: false}).on("error", util.log))
        .on("error", swallowError)
        .pipe(gulp.dest("./public/js"));
});


gulp.task("test-api",  function () {
    process.env.NODE_ENV = "test";
    process.env.NODE_PORT = "9001";

    return gulp.src("./tests/api/*.js", {read: false}).pipe(mocha({
        timeout: 2000,
        useColors: true,
        useInlineDiffs: true,
    })).once("error", function (err) {
        util.log(err.name, err.message);
        process.exit(1);
    }).once("end", function () {
        process.exit();
    });
});

// Run tasks
gulp.task("default", ["js", "css"], function () {
    util.log("Build complete!");
});

gulp.task("watch", ["default"], function () {
    gulp.watch("./app/styles/**/*", ["css"]);
    gulp.watch("./app/scripts/**/*", ["js"]);
});
