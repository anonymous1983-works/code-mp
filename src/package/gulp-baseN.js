var es = require('event-stream');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');
var mime = require('mime');
var combine = require('./combine')();

module.exports = function (opts) {

    opts = opts || {};

    var settings = {
        combine: combine.withoutRepetitions(['a', 'Z', 'd', 'V', 'h', 'F', 'l', 'e', '8', '3', '9', 't', '2', 'p', 'S', 'W', '1', 'q', 'u', 'o', 'E', 'c', '7', 'Q', 'b', 'i', 'v', 'x', 'L', 'm', 'N'], 3, true),
        dictionary: [],
        reg_exp: {
            html: /class=[\"|\'](.*?)[\"|\']/gs,
            css: /\.([a-zA-Z_][\w-_]*[^\.\s\{#:\,;])/gm,
            get: {
                html: function (str) {
                    return new RegExp('class=[\"|\'](' + str + ')[\"|\']', "gs");
                },
                css: function (str) {
                    return new RegExp('/\.(' + str + ')*[\.\s\{#:\,;]', "gm")
                }

            }
        }
    };


    var baseN = function (file, callback) {
        var reg_exp = /class=[\"|\'](.*?)[\"|\']/gs;

        var isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function';
        var isBuffer = file.contents instanceof Buffer;

        console.log(path.extname(file.path));


        /*if (isBuffer) {
            var str = String(file.contents);

            var matches = [],
                found;
            while (found = settings.reg_exp.html.exec(str)) {
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
                    if (settings.dictionary[cssArray[j]] === undefined && cssArray[j] !== '') {
                        var _currentClassCrypt = combine.get.random(settings.combine);
                        settings.dictionary[cssArray[j]] = _currentClassCrypt.value;
                    }
                    cssCrypt.push(settings.dictionary[cssArray[j]]);
                }
                var _reg_exp = new RegExp('class=[\"|\'](' + matches[i].css + ')[\"|\']', "gs");
                str = str.replace(_reg_exp, "class=\"" + cssCrypt.join(' ') + "\"");
            }

            file.contents = new Buffer(str);

            return callback(null, file);
        }*/
        callback(null, file);
    };
    return es.map(baseN);
};
