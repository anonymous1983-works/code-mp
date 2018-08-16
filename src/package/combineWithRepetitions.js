"use strict";

/*Object.defineProperty(exports, "__esModule", {
    value: true
});*/
//exports.default = combineWithRepetitions;
/**
 * @param {*[]} comboOption
 s
 * @param {number} comboLength
 * @return {*[]}
 */
exports.combineWithRepetitions = function (comboOptions, comboLength) {
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
        var smallerCombos = combineWithRepetitions(comboOptions.slice(optionIndex), comboLength - 1);

        smallerCombos.forEach(function (smallerCombo) {
            combos.push([currentOption].concat(smallerCombo));
        });
    });

    return combos;
}