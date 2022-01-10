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

// Request Tokens
// @TODO Watch the tutorial, save the world (That's how it goes right?)
handlers.tokens = (data, callback) => {
    // @TODO - This is defunct, change using tutorial. 
    callback(200, 'Change ME!);
}

// Sub-methods
var _users = {};
var _tokens = {};

// Handle - POST
// Required Fields in data: username, password, firstName, lastName, 
//                          phone, tosAgreement
// Optional Fields in data: (none)
_users.POST = (data, callback) => {
    var userFilename = data.queryString.name.split(' ').join('_').trim();
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
    } else {
        callback(400, {'Error' : 'User did not meet request standards.'});
    }
};

/*
   Handle - GET
   Required data: userFilename
   Optional data: (none)
  
   Read out the stored data for the user with said name in the response.
  
   @TODO - add validation
*/
_users.GET = (data, callback) => {
    var userFilename = data.queryString.name.split(' ').join('_').trim();
    _data.read('users', userFilename, (err, data) => {
        console.log('Here: ', err, 'Data: ', data, '\n\n\n');
        if (err === 200) {
            // Remove the hashedPassword.
            delete data.hashedPassword;
            helpers.logger('Success', 'Data is readable', true);
            callback(200, data);
        } else {
            // Not found
            callback(400, {'Error':'This item does not exist or cannot be accessead'});
        }
    });
};

// Handle - PUT
// Required data: phone
// Optional data: firstName, lastName, username, password (Must have at least one)
// @TODO - Only valid users can do this.
_users.PUT = (data, callback) => {
    // @TODO - user the userFilename
    var phone = helpers.validate(data.payload.phone.trim(), false, true);

    // Check the optional fields.
    var firstName = helpers.validate(data.payload.firstName, false, false);
    var lastName = helpers.validate(data.payload.lastName, false, false);
    var username = helpers.validate(data.payload.username, false, false);
    var password = helpers.validate(data.payload.password, false, false);
};

// Handle - DELETE
_users.DELETE = (data, callback) => {
    // Simply delete and check for errors.
    var userFilename = helpers.validate(data.queryString.name.split(' ').join('_').trim(), false, false);

    // Die! Murder Bot! Die!
    _data.delete('users', userFilename, (err, data) => {
        if (!err) {
            callback(200, 'You have slain the dragon!');
        } else {
            // File may not exist or is permission locked.
            callback(400, data);
        }
    });
};

// Token Sub Methods
// @TODO - Write the GET, POST, PUT, DELETE methods for these.
_tokens.POST = (data, callback) {
    callback(200);
}

// Assign Sub-Methods
handlers._users = _users;
handlers._tokens = _tokens;

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

