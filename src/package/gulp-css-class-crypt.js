var es = require('event-stream');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');
var mime = require('mime');
var combine = require('./combine')();

module.exports = function (opts) {

    opts = opts || {};
    var dictionaryClassCss = [];

    if (!opts.baseDir) opts.baseDir = path.dirname(module.parent.filename);

    var cssClassCrypt = function (file, callback) {
        var arrayClassCrypt = opts.arrayClassCrypt;
        //var rand = combine.get.random(tab);
        var app_path = opts.baseDir;
        var reg_exp = /class=[\"|\'](.*?)[\"|\']/gs;
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
                // css to Array
                var cssArray = matches[i].css.split(/[\s,]+/);
                var cssCrypt = [];

                for (var j = 0, len2 = cssArray.length; j < len2; j++) {
                    if (dictionaryClassCss[cssArray[j]] === undefined && cssArray[j] !== '') {
                        var _currentClassCrypt = combine.get.random(arrayClassCrypt);
                        dictionaryClassCss[cssArray[j]] = _currentClassCrypt.value;
                    }
                    cssCrypt.push(dictionaryClassCss[cssArray[j]]);
                }
                var _reg_exp = new RegExp('class=[\"|\']('+matches[i].css+')[\"|\']',"gs");
                str = str.replace(_reg_exp, "class=\"" + cssCrypt.join(' ') + "\"");
            }

            file.contents = new Buffer(str);

            return callback(null, file);
        }
        callback(null, file);
    };
    return es.map(cssClassCrypt);
};
