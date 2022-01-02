/**
 * Helpers for various tasks in the library.
 */

// Dependencies
var crypto = require('crypto');
var config = require('../config');

// Container for various helpers.
var helpers = {};

// Craete a SHA256 hash
helpers.hash = (str) => {
    if (typeof(str) === 'string' && str.length > 0) {
        return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    } else {
        return false;
    }
};

// Helper function to handle validations.
// Reform the valid candidates by trimming strings and handle phone # lengths.
// @function {string|false}
// @param {string} candidate
// @param {boolean} isBoolean
// @param {boolean} isPhone
helpers.validate = (candidate, isBoolean, isPhone) => {

    var validCandidate = false;
    if (isBoolean) {
        validCandidate = typeof (candidate) === 'boolean' &&
            candidate === true;

    } else {
        validCandidate = typeof (candidate) === 'string' &&
        candidate.length > 0 ? candidate.trim() : false;

        if (validCandidate && isPhone) {
            validCandidate = validCandidate.split("-").join("");
            validCandidate.length === 10 ? validCandidate : false;
        }
    }

    return validCandidate;
}

helpers.parseJsonToObject = (str) => {
    if (typeof(str) === 'string') {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.log('Object could not be parsed.');
            return {};
        }
    }
    return str;
};

module.exports = helpers;




