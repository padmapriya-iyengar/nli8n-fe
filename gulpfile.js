const gulp = require("gulp");
const path = require('path');
var clean = require('gulp-clean');
var argv = require('yargs').argv;

gulp.task("clear", function() {
    var destPath = path.resolve(process.cwd() + '/../agc-node-api/dist/app');
    return gulp.src(
        [destPath+'/*'],
        {read: false}
      )
        .pipe(clean({force: true})); 
});

gulp.task("migrate",  gulp.series('clear', function() {
    var isProduction = !argv.production ? false : true
    var distName = isProduction?'/production':'/development'
    var sourcePath = path.resolve(process.cwd() + '/src/../dist'+distName);
    var destPath = path.resolve(process.cwd() + '/../agc-node-api/dist/app');
    return gulp.src([sourcePath+'/*'])
        .pipe(gulp.dest(destPath))
}));

gulp.task("default",  gulp.series('migrate', function(){
    return new Promise(function(resolve, reject) {
        console.log("Build migrated successfully..");
        resolve();
      });
}));