var _ = require('lodash');

var alBhedTranslator = {}

function isUpperCase(myString) {
    return (myString == myString.toUpperCase());
}

function isLowerCase(myString) {
    return (myString == myString.toLowerCase());
}

function toAlbhed(textInput) {
    var lowerStandardArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    var standardArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    var lowerAlBhed = ["y", "p", "l", "t", "a", "v", "k", "r", "e", "z", "g", "m", "s", "h", "u", "b", "x", "n", "c", "d", "i", "j", "f", "q", "o", "w"];
    var alBhed = ["Y", "P", "L", "T", "A", "V", "K", "R", "E", "Z", "G", "M", "S", "H", "U", "B", "X", "N", "C", "D", "I", "J", "F", "Q", "O", "W"];

    var result = []

    _.each(textInput, function (c) {
        var characterIndex = -1;
        var charIsUpperCase = false;

        if (isUpperCase(c)) {
            characterIndex = _.indexOf(standardArray, c);
            charIsUpperCase = true;
        } else {
            characterIndex = _.indexOf(lowerStandardArray, c);
            charIsUpperCase = false;
        }

        if (characterIndex !== -1) {
            if (charIsUpperCase) {
                result.push(alBhed[characterIndex]);
            }
            else{
                result.push(lowerAlBhed[characterIndex]);
            }            
        } else {
            result.push(c);
        }
    });
    
    result = result.join('');    
    return result;
}

alBhedTranslator.toAlBhed = toAlbhed;

module.exports = alBhedTranslator;