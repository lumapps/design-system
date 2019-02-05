var gulp = require("gulp");
var historyApiFallback = require("connect-history-api-fallback");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");

var processors = [
  require("autoprefixer")({ browsers: ["last 2 versions"] }),
  require("postcss-pxtorem")({ replace: false }),
  require("cssnano")({ zindex: false })
];

gulp.task("styles", function() {
  gulp
    .src("demo/scss/**/*.scss")
    .pipe(
      sass({ includePaths: ["node_modules/sass-mq/"] }).on(
        "error",
        sass.logError
      )
    )
    .pipe(postcss(processors))
    .pipe(gulp.dest("demo/scss/"))
    .pipe(browserSync.stream());
});

gulp.task("default", function() {
  browserSync.init({
    server: {
      baseDir: "./",
      middleware: [historyApiFallback()]
    }
  });

  gulp.watch(
    [
      "src/components/**/*.scss",
      "src/core/scss/**/*.scss",
      "src/core/scss/lumx.scss",
      "demo/layout/**/*.scss",
      "demo/scss/app.scss"
    ],
    ["styles"]
  );
  gulp
    .watch(["src/components/**/*.html", "demo/components/**/*.html", "demo/layout/**/*.html"])
    .on("change", browserSync.reload);
  gulp
    .watch(["src/components/**/*.js", "src/core/**/*.js", "demo/components/**/*.js"])
    .on("change", browserSync.reload);
});
