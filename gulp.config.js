module.exports = function () {
    var config = {
        app: 'Front',
        dist: './dist/',
        src: './src/',
        sass: {
            src: ['src/sass/styles.scss'],
            dest: './dist/assets/css/',
            output: 'styles.css',
            watch: ['./src/sass/**/*.scss']
        },
        sass64: {
            src: ['src/sass/styles.64.scss'],
            dest: './dist/assets/css/',
            output: 'styles.64.css',
            watch: ['./src/sass/**/*.64.scss']
        },
        js: {
            src: ['./node_modules/jquery/dist/jquery.js',
                './node_modules/popper.js/dist/umd/popper.js',
                './node_modules/bootstrap/dist/js/bootstrap.js',
                './node_modules/babel-polyfill/dist/polyfill.js',
                './node_modules/slick-carousel/slick/slick.js',
                './src/js/**/*.js'],
            dest: './dist/assets/js/',
            output: 'scripts.js',
            watch: ['./src/js/**/*.js']
        },
        img: {
            src: './src/images/**',
            dest: './dist/assets/images/',
            watch: ['./src/images/**']
        },
        html: {
            src: ['./src/html/*.html', './src/html/pages/**/*.html'],
            dest: './dist/',
            watch: ['./src/html/**/*.html']
        },
    };
    return config;
}