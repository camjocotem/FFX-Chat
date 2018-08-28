var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    minifyCss = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    gulpIf = require('gulp-if'),
    stripDebug = require('gulp-strip-debug'),
    ngAnnotate = require('gulp-ng-annotate'),
    minifyHtml = require('gulp-htmlmin'),
    gzip = require('gulp-gzip'),
    replace = require('gulp-replace'),
    del = require('del'),
    browserSync = require('browser-sync'),
    argv = require('yargs').argv,
    env = require('node-env-file');

env(__dirname + '/../.env');

var reload = browserSync.reload;
var sourceRoot = './src/';
var outputRoot = './build/';

var scssFiles = [
    sourceRoot + 'sass/angular-material.scss',
    sourceRoot + 'sass/main.scss'
];

var jsDepSources = [
    sourceRoot + 'lib/angular.js',
    sourceRoot + 'lib/angular-animate.js',
    sourceRoot + 'lib/angular-aria.js',
    sourceRoot + 'lib/angular-material.js',
    sourceRoot + 'lib/angular-messages.js',
    sourceRoot + 'lib/angular-ui-router.js',
    sourceRoot + 'lib/lodash.js',
    sourceRoot + 'lib/modernizr.js',
    sourceRoot + 'lib/moment.js',
    sourceRoot + 'lib/socket.io.js',
    sourceRoot + 'lib/socket.js'     
];

var appSources = [
	sourceRoot + 'app/base/**/*.js'
];

function bundleJs(sources, outputFileName) {
    gulp.src(sources)
        .pipe(sourcemaps.init({
            base: 'src'
        }))
        .pipe(ngAnnotate({
            remove: true,
            add: true,
            single_quotes: true
        }))
        .pipe(concat(outputFileName))
        .pipe(gulpIf(argv.production, stripDebug()))
        .pipe(gulpIf(argv.production, uglify()))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(sourceRoot + 'lib/'))
        .pipe(gulpIf(argv.gzip, replace(/\.html/g, '.html.gz')))
        .pipe(gulp.dest(outputRoot + 'lib'));
}

gulp.task('scss', function () {
    gulp.src(scssFiles)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCss())
        .pipe(gulp.dest(sourceRoot + 'css'))
        .pipe(gulp.dest(outputRoot + 'css'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('clean', function () {
    try {
        var targets = [outputRoot + '**/*.*'],
            paths = del.sync(targets);
        gutil.log('Deleted files/folders:\n', paths.join('\n'));
    } catch (e) {
        gutil.log('Error - cleanOutputFiles');
    }
});

gulp.task('jsDependency', function () {
    gulp.src(jsDepSources)
        .pipe(concat('dependency.js'))
        .pipe(uglify())
        .pipe(gulpIf(argv.production, gulp.dest(outputRoot + 'lib')))
        .pipe(gulp.dest(sourceRoot + 'lib'));
});

gulp.task('jsAppBundle', function () {
    bundleJs(sourceRoot + 'app/app.js', 'app.js');
    bundleJs(sourceRoot + 'app/app.env.js', 'app.env.js');
    bundleJs(sourceRoot + 'app/app.states.js', 'app.states.js');
    bundleJs(appSources, 'chatApp.js');
});

gulp.task('minifyHtml', function () {
    gulp.src([sourceRoot + '*.html', sourceRoot + '**/*.html'])
        .pipe(minifyHtml({
            collapseWhitespace: true
        }))
        .pipe(gulpIf(argv.gzip, replace(/\.html/g, '.html.gz')))
        .pipe(gulpIf(argv.gzip, replace(/\.css/g, '.css.gz')))
        .pipe(gulpIf(argv.gzip, replace(/\.js/g, '.js.gz')))
        .pipe(gulp.dest(outputRoot));
});
// Publish to Amazon S3 / CloudFront
gulp.task('deploy', function () {
    var awspublish = require('gulp-awspublish'),
        aws = {};
     var aws = {
     	"accessKeyId": process.env.AWS_S3_KEY,
     	"secretAccessKey": process.env.AWS_S3_SECRET,
     	"params": {
     		Bucket: process.env.BUCKET
     	},
     	"region": 'us-east-1'
     };
    var publisher = awspublish.create(aws),
        headers = {
            'Cache-Control': 'max-age=315360000, no-transform, public'
        };

    return gulp.src('./build/**')
        // Gzip, set Content-Encoding headers
        .pipe(awspublish.gzip({
            ext: '.gz'
        }))
        // Publisher will add Content-Length, Content-Type and headers specified above
        // If not specified it will set x-amz-acl to public-read by default
        .pipe(publisher.publish(headers))
        // Create a cache file to speed up consecutive uploads
        .pipe(publisher.cache())
        // Print upload updates to console
        .pipe(awspublish.reporter());
});

gulp.task('default', ['clean', 'scss', 'jsDependency', 'jsAppBundle', 'minifyHtml']);

gulp.task('default-with-watch', ['default'], function () {
    gulp.watch(sourceRoot + 'app/**/*.js', ['jsAppBundle']);
    gulp.watch(sourceRoot + 'sass/*.scss', ['scss']);
}, function () {
    console.log("Watching files");
});