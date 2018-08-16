var es = require('event-stream');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');
var mime = require('mime');

module.exports = function (opts) {

    opts = opts || {};
    var dictionaryClassCss = [];

    if (!opts.baseDir) opts.baseDir = path.dirname(module.parent.filename);

    var cssClassCrypt = function (file, callback) {
        console.log(path.basename(file.path));
        var app_path = opts.baseDir;
        var reg_exp = /class=\"(.*?)\"/gs;
        var isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function';
        var isBuffer = file.contents instanceof Buffer;
        if (opts.useRelativePath) {
            app_path = file.path.replace(/\/[^/]+$/, '/');
        }
        if (isBuffer) {
            var str = String(file.contents);

            var matches = [],
                found;
            while (found = reg_exp.exec(str)) {
                matches.push({
                    'txt': found[0],
                    'css': found[1]
                });
            }

            for (var i = 0, len = matches.length; i < len; i++) {

                //console.log(i +' = ' + matches[i].css);
                // css to Array
                var cssArray = matches[i].css.split(/[\s,]+/);
                //console.log(cssArray);
                //console.log('-------------------------------');
                var j = 0;
                for (var j = 0, len2 = cssArray.length; j < len2; j++) {
                    if (dictionaryClassCss[cssArray[j]] === undefined) {
                        dictionaryClassCss[cssArray[j]] = cssArray[j];
                    }

                    //console.log(i + ' ---' + j + ' -- '+ cssArray[j]);
                }
                // Array to string
                //var cssCrypt = cssArray.join(' ');

                //str = str.replace(matches[i].txt, 'url(' + ('data:' + mime.lookup(filepath) + ';base64,' + b.toString('base64')) + ')');

                /*if(matches[i].force) {
                    if (matches[i].url.indexOf('data:image') === -1) { //if find -> image already decoded
                        var filepath = app_path + path.normalize(matches[i].url);
                        if (fs.existsSync(filepath)) {
                            var size = fs.statSync(filepath).size;

                            // File will not be included because of its size
                            if (opts.maxSize && size > opts.maxSize && !matches[i].force) {
                                if (opts.debug) gutil.log('gulp-assets-to-base64:', gutil.colors.yellow('file is greater than ' + Math.round(size / 1024) + 'kb > ' + Math.round(opts.maxSize / 1024) + 'kb => skip') + gutil.colors.gray(' (' + filepath + ')'));
                                str = str.replace(matches[i].txt, 'url(' + matches[i].url + ')');
                            }

                            // Else replace by inline base64 version
                            else {
                                var b = fs.readFileSync(filepath);
                                str = str.replace(matches[i].txt, 'url(' + ('data:' + mime.lookup(filepath) + ';base64,' + b.toString('base64')) + ')');
                            }

                        } else {
                            if (opts.debug) gutil.log('gulp-assets-to-base64:', gutil.colors.red('file not found => skip') + gutil.colors.gray(' (' + filepath + ')'));
                        }
                    }
                }*/
            }
            console.log(dictionaryClassCss);
            console.log(' 1 - ' + dictionaryClassCss.length);

            file.contents = new Buffer(str);

            return callback(null, file);
        }
        callback(null, file);
    };
    return es.map(cssClassCrypt);
};
