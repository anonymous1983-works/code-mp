var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    extender = require('gulp-html-extend'),
    inline_base64 = require('gulp-inline-base64'),
    config = require('./gulp.config')(),
    assetsToBase64 = require('./src/package/gulp-assets-to-base64'),
    baseN = require('./src/package/gulp-baseN');
    newBaseN = require('./src/package/baseN');

$ = require('gulp-load-plugins')({lazy: true});


gulp.task('styles', function () {
    return gulp
        .src(config.sass.src)
        .pipe($.sass().on('error', $.sass.logError))
        .pipe(assetsToBase64({
            baseDir: config.src,
            maxSize: 14 * 1024,
            debug: true
        }))
        .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe($.concat(config.sass.output))
        .pipe(gulp.dest(config.sass.dest))
        .pipe($.sass().on('error', $.sass.logError))
        .pipe(assetsToBase64({
            baseDir: config.src + 'base64/',
            maxSize: 14 * 1024,
            debug: false
        }))
        .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe($.cleanCss())
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(config.sass.dest))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('styles:64', function () {
    return gulp.src(config.sass64.src)
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.concat(config.sass64.output))
        .pipe($.base64({
            baseDir: config.src,
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
            exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
            debug: false
        }))
        .pipe(gulp.dest(config.sass64.dest))
        .pipe($.sass())
        .pipe($.rename({suffix: '.min'}))
        .pipe($.base64({
            baseDir: config.src,
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
            exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
            maxImageSize: 8 * 1024, // bytes
            debug: false
        }))
        .pipe($.cleanCss())
        .pipe(gulp.dest(config.sass64.dest))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function () {
    return gulp
        .src(config.js.src)
        .pipe($.concat(config.js.output))
        .pipe(gulp.dest(config.js.dest))
        .pipe(browserSync.reload({stream: true}))
        .pipe($.uglify())
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(config.js.dest));
});

gulp.task('images:clean', function () {
    return gulp
        .src(config.img.dest)
        .pipe($.clean());
})

// Optimizes the images that exists
gulp.task('images', ['images:clean'], function () {
    return gulp
        .src(config.img.src)
        .pipe($.changed('images'))
        .pipe($.imagemin({
            // Lossless conversion to progressive JPGs
            progressive: true,
            // Interlace GIFs for progressive rendering
            interlaced: true
        }))
        .pipe(gulp.dest(config.img.dest))
        .pipe($.size({title: 'images'}));
});

gulp.task('html', [], function () {
    return gulp.src(config.html.src)
        .pipe(extender({annotations: true, verbose: false})) // default options
        .pipe(assetsToBase64({
            baseDir: config.src + 'images/',
            maxSize: 14 * 1024,
            debug: true
        }))
        .pipe(gulp.dest(config.html.dest));
});

gulp.task('baseN', [], function () {
    //'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
    // 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z';
    return newBaseN({
        debug: true,
        src: './dist/',
        dist: './dist-n/',
        combine: {
            n: ['a', 'Z', 'd', 'V', 'h', 'F', 'l', 'e', 'A', 'K', 'I', 't', 'D', 'p', 'S'],
            k: 2
        }
    });

});

gulp.task('test-baseN', ['baseN'], function () {
    browserSync({
        server: {
            baseDir: './dist-n/',
            injectChanges: true // this is new
        },
        port: 3310
    });
});

gulp.task('browser-sync', ['styles', 'scripts'], function () {
    browserSync({
        server: {
            baseDir: config.dist,
            injectChanges: true // this is new
        }
    });
});

gulp.task('deploy', function () {
    return gulp
        .src('./dist/**/*')
        .pipe(ghPages());
});

gulp.task('watch', function () {
    // Watch .html files
    gulp.watch(config.html.watch, ['html', browserSync.reload]);
    gulp.watch(config.html.watch).on('change', browserSync.reload);
    // Watch .sass files
    gulp.watch(config.sass.watch, ['styles', browserSync.reload]);
    // Watch .64.sass files
    gulp.watch(config.sass64.watch, ['styles:64', browserSync.reload]);
    // Watch .js files
    gulp.watch(config.js.watch, ['scripts', browserSync.reload]);
    // Watch image files
    gulp.watch(config.img.watch, ['images', browserSync.reload]);
});

gulp.task('default', function () {
    gulp.start(
        'styles',
        'styles:64',
        'scripts',
        'images',
        'html',
        'browser-sync',
        'watch'
    );
});
