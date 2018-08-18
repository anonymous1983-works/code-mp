var es = require('event-stream');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');
var mime = require('mime');

module.exports = function (opts) {

    opts = Object.assign({}, {
        combine: {
            n: ['a', 'Z', 'd', 'V', 'h', 'F', 'l', 'e', 'A', 'K', 'I', 't', 'D', 'p', 'S', 'W', 'H', 'q', 'u', 'o', 'E', 'c', 'P', 'Q', 'b', 'i', 'v', 'x', 'L', 'm', 'N'],
            k: 3
        }
    }, opts);

    // https://www.dcode.fr/combinaisons
    var combine = {
        withRepetitions: function (comboOptions, comboLength, join) {
            if (comboLength === 1) {
                return comboOptions.map(function (comboOption) {
                    return [comboOption];
                });
            }

            // Init combinations array.
            var combos = [];

            // Eliminate characters one by one and concatenate them to
            // combinations of smaller lengths.
            comboOptions.forEach(function (currentOption, optionIndex) {
                var smallerCombos = combine.withRepetitions(comboOptions.slice(optionIndex), comboLength - 1, join);

                smallerCombos.forEach(function (smallerCombo) {
                    if (join) {
                        combos.push([currentOption].join('').concat(smallerCombo));
                    } else {
                        combos.push([currentOption].concat(smallerCombo));
                    }
                });
            });

            return combos;
        },
        withoutRepetitions: function (comboOptions, comboLength, join) {
            if (comboLength === 1) {
                return comboOptions.map(function (comboOption) {
                    return [comboOption];
                });
            }

            // Init combinations array.
            var combos = [];

            // Eliminate characters one by one and concatenate them to
            // combinations of smaller lengths.
            comboOptions.forEach(function (currentOption, optionIndex) {

                var smallerCombos = combine.withoutRepetitions(comboOptions.slice(optionIndex + 1), comboLength - 1, join);

                smallerCombos.forEach(function (smallerCombo) {
                    if (join) {
                        combos.push([currentOption].join('').concat(smallerCombo));
                    } else {
                        combos.push([currentOption].concat(smallerCombo));
                    }

                });
            });

            return combos;
        },
        get: {
            random: function (tab) {
                var key = Math.floor(Math.random() * tab.length);
                var value = tab[key];
                tab.splice(key, 1);

                return {
                    'key': key,
                    'value': value
                };
            }
        }
    };

    var settings = {
        combine: combine.withoutRepetitions(opts.combine.n, opts.combine.k, true),
        dictionary: {},
        reg_exp: {
            html: /class=[\"|\'](.*?)[\"|\']/gs,
            css: /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)(?![^\{]*\})/gm,
            get: {
                html: function (str) {
                    return new RegExp('class=[\"|\'](' + str + ')[\"|\']', 'gs');
                },
                css: function (str) {
                    return new RegExp('\\.(' + str + ')[\\s\\}\\{:><\\.,*]', 'gm');
                }

            }
        }
    };

    var log = function (str) {
        var datetime = new Date();
        str = '\n[' + datetime.toDateString() + '] ' + str.toString();
        fs.appendFile('./log-baseN.txt', str, function (err) {
            if (err) throw err;
        });
    };

    var map = require('map-stream');
    var vfs = require('vinyl-fs');

    var htmlToBaseN = function (file, callback) {

        var isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function';
        var isBuffer = file.contents instanceof Buffer;

        //console.log(path.extname(file.path));


        if (isBuffer) {
            var str = String(file.contents);

            var matches = [],
                found;
            while (found = settings.reg_exp.html.exec(str)) {
                matches.push({
                    'fullMatch': found[0],
                    'group': found[1]
                });
            }


            for (var i = 0, len = matches.length; i < len; i++) {

                var className = matches[i].group,
                    classNameCrypt = '',
                    classNameArray = className.split(/[\s,]+/);
                //classNameArrayCrypt = [];

                for (var j = 0, len2 = classNameArray.length; j < len2; j++) {
                    var subClassName = classNameArray[j];
                    if (settings.dictionary[subClassName.toString()] === undefined && subClassName !== '') {
                        var _currentClassCrypt = combine.get.random(settings.combine);
                        settings.dictionary[subClassName.toString()] = _currentClassCrypt.value.toString();
                    }
                    classNameCrypt += (classNameCrypt !== '') ? ' ' + settings.dictionary[subClassName.toString()] : settings.dictionary[subClassName.toString()];
                    //classNameArrayCrypt.push(settings.dictionary[subClassName]);
                }
                var _reg_exp = settings.reg_exp.get.html(className);
                str = str.replace(_reg_exp, "class=\"" + classNameCrypt + "\"");
                //str = str.replace(_reg_exp, "class=\"" + classNameArrayCrypt.join(' ') + "\"");
            }

            file.contents = new Buffer(str);

            return callback(null, file);
        }

        callback(null, file);
    };

    var updateDictionary = function (file, callback) {

        var isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function';
        var isBuffer = file.contents instanceof Buffer;


        if (isBuffer) {
            var str = String(file.contents);

            var matches = [],
                found;
            while (found = settings.reg_exp.css.exec(str)) {
                matches.push({
                    'fullMatch': found[0],
                    'group': found[1]
                });
            }

            for (var i = 0, len = matches.length; i < len; i++) {
                var className = matches[i].group;

                if (settings.dictionary[className.toString()] === undefined && className !== '') {
                    var _currentClassCrypt = combine.get.random(settings.combine);
                    settings.dictionary[className.toString()] = _currentClassCrypt.value;
                }
            }

            return callback(null, file);
        }

        callback(null, file);
    };

    var cssToBaseN = function (file, callback) {

        var isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function';
        var isBuffer = file.contents instanceof Buffer;
        var _json_dictionary = JSON.parse(JSON.stringify(settings.dictionary));


        if (isBuffer) {
            var str = String(file.contents);

            var matches = [],
                found;
            while (found = settings.reg_exp.css.exec(str)) {
                matches.push({
                    'fullMatch': found[0],
                    'group': found[1]
                });
            }


            for (var key in _json_dictionary) {
                var _reg_exp = settings.reg_exp.get.css(key);
                str = str.replace(_reg_exp, "." + _json_dictionary[key]);
            }

            file.contents = new Buffer(str);

            return callback(null, file);
        }

        callback(null, file);
    };

    // Crypt HTML
    log('Starting Crypt baeN Html file');
    return vfs.src(path.join(opts.src, '**/*.html'))
        .pipe(map(htmlToBaseN))
        .pipe(vfs.dest(opts.dist))
        .on('end', function () {
            log('Finished Crypt baeN Html file & Starting Crypt baeN CSS file');
            // Crypt Syles
            return vfs.src(path.join(opts.src, '**/*.css'))
                .pipe(map(updateDictionary))
                //.pipe(vfs.dest(opts.dist))
                .on('end', function () {
                    log(JSON.stringify(settings.dictionary));
                    return vfs.src(path.join(opts.src, '**/*.css'))
                        .pipe(map(cssToBaseN))
                        .pipe(vfs.dest(opts.dist))
                        .on('end', function () {
                            log('Finished Crypt baeN CSS file');
                        });
                });
        });


    //return es.map(baseN);
};
