/*
 * API Library Handlers
 * @file - lib/handlers.js
 * @author - Isaac A. White
 */ 

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');

// Define request handlers.
var handlers = {};

// Request Users
handlers.users = (data, callback) => {
    // Callback should return a 200, 201, 403, or 404
    // Acceptable methods
    var methods = ['POST', 'GET', 'PUT', 'DELETE'];
    var index = methods.indexOf(data.method);
    if (index > -1 && index < methods.length) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Users Sub-methods
var _users = {};

// Handle - POST
// Required Fields in data: username, password, firstName, lastName, 
//                          phone, tosAgreement
// Optional Fields in data: (none)
_users.POST = (data, callback) => {
    var userFilename = data.queryString.name.split(' ').join('_');
    var firstName    = helpers.validate(data.payload.firstName, false, false);
    var lastName     = helpers.validate(data.payload.lastName, false, false);
    var username     = helpers.validate(data.payload.username, false, false);
    var password     = helpers.validate(data.payload.password, false, false);
    var tosAgreement = helpers.validate(data.payload.tosAgreement, true,  false);
    var phone        = helpers.validate(data.payload.phone, false, true);

    if (firstName && lastName && username && password && tosAgreement && phone) {
        _data.read('users', userFilename, (err, data) => {
            if (err) {
                console.log('Are we reading \n');
                var hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    var userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'username': username,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': tosAgreement,
                        'phone': phone,
                    }
                    // Store the new user to the users directory.
                    _data.create('users', userFilename, userObject, (err) => {
                            if (!err) {
                                callback(201, {'Success' : 'The user has been created.'});
                            } else {
                                // Part of the tutorial. I am not sure this is necessary.
                                console.log(err);
                                callback(403, {'Error':err});
                            }
                        }
                    );
                } else {
                    console.log('Hash Failed.');
                    callback(500, {'Error' : 'You didn\'t keep it secret. You didn\'t keep it safe.'});
                }
            } else {
                callback(400, {'Error': 'You have a pre-existing condition.'});
            }
        });
    }
};

// Handle - GET
_users.GET = (data, callback) => {
    callback(403, 'GET OUTTA HERE!!.', false);
    callback(404, 'The user does not exist.', null);
    callback(200, 'Found user.', res.data);
};

// Handle - PUT
_users.PUT = (data, callback) => {
    callback(404, 'Umm... you sure you got the right bar?');
    callback(403, 'Ha! Nice try Nancy Drew.');
};

// Handle - DELETE
_users.DELETE = (data, callback) => {
    callback(404, 'There\'s nothing here to delete');
    callback(403, 'You shall not defeat the delete!');
    callback(200, 'You sunk my file ship.');
};

// Assign Sub-Methods
handlers._users = _users;

// Request Home Ping
handlers.home = (data, callback) => {
    // Callback should return a HTTP Code and a payload.
    callback(200, { 'name' : 'Isaac' }); 
};

// Request Ping
handlers.hitMeh = (data, callback) => {
    // Simple response to allow user to know they hit this route.
    callback(200, { 'Dear Client' : 'You Rang?' }); 
};

// Request Not Found
// Default fallback if no url can be matched.
handlers.notFound = (data, callback) => {
    callback(404);
};

// As always, export the handlers.
module.exports = handlers;

