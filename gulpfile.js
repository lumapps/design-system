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
      "components/**/*.scss",
      "core/scss/lumx.scss",
      "layout/**/*.scss",
      "scss/app.scss"
    ],
    ["styles"]
  );
  gulp
    .watch(["components/**/*.html", "demo/**/*.html", "layout/**/*.html"])
    .on("change", browserSync.reload);
  gulp
    .watch(["components/**/*.js", "core/**/*.js", "demo/**/*.js"])
    .on("change", browserSync.reload);
});
