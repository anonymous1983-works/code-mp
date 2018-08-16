module.exports = function () {
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
    return combine;
};