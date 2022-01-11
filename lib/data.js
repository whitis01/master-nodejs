/**
 *  Library for storing and editing the data.
 *  @file - file.js
 *  @author - Isaac A. White
 *  None of these functions should be called outside of a handler.
 *  This is to say these should never be called within index.js
 */

// DEPENDENCIES
// Access to the file system.
var fs   = require('fs');
// Normalize paths.
var path = require('path');
// Help ME!
var helpers = require('./helpers');


// CONTAINERS
// Create a base object for the library.
var lib = {};

// CODE
// Define the base directory on the lib func.
lib.baseDir = path.join(__dirname, '/../.data/');

// Function for writing data to a file.
lib.create = (dir, fileName, data, callback) => {
    // Open file
    fs.open(lib.baseDir + dir + '/' + fileName + '.json', 'wx', (err, fileDescriptor) => {
        // Check for a fileDescriptor and no errors.
        if (!err && fileDescriptor) {
            // Convert data from JSON to a writable string.
            var writableString = JSON.stringify(data);
            // Write to file.
            fs.writeFile(fileDescriptor, writableString, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            // FALSE errors mean everything went correctly.
                            callback(false);
                        } else {
                            callback('You let the door hit you on the way out... of the file close.');
                        }
                    })
                } else {
                    // Something bad happened. Roll over and die.
                    callback('I told you I don\'t have your fucking spades.');
                }
            });
        } else {
            callback('I don\'t have your fucking spades.');
        }
    });
};


// Library function to read from a specified file.
lib.read = (dir, fileName, callback) => {

    fs.readFile(lib.baseDir + dir + '/' + fileName + '.json', 'utf-8', (err, data) => {
        if (err) {
            callback(400, err);
        } else {
            callback(200, helpers.parseJsonToObject(data));
        }
    });
};

// Library function to update the desired file,
lib.update = (dir, fileName, data, callback) => {
   fs.open(lib.baseDir + dir + '/' + fileName + '.json', 'r+', (err, fileDescriptor) => {
            if (!err && fileDescriptor) {

                // Convert data from JSON to a writable string.
                var writableString = JSON.stringify(data);
                
                // Truncate the file. This is a replace or overwrite
                // to a text doc which is akin to a row in SQL.
                fs.ftruncate(fileDescriptor, (err) => {
                    if (!err) {
                        fs.writeFile(fileDescriptor, writableString, (err) => {
                            if (!err) {
                                fs.close(fileDescriptor, (err) => {
                                    if (!err) {
                                        // FALSE means the write did not fail.
                                        callback(false);
                                    } else {
                                        // Writing failed.
                                        callback('Not your day is it?');
                                    }
                                });
                            }
                        });
                    } else {
                        // Truncation failed
                        callback('Oh No!');
                    }
                });    
            } else {
                callback('You must learn to exist before you can exist');
            }
        }
   );
};

// Library function to delete the desired file.
lib.destroy = (dir, filename, callback) => {
    var path = lib.baseDir + dir + '/' + filename + '.json';
    fs.unlink(path, (err) => {
        if (!err) {
            // Successful Deletion
            callback(false);
        } else {
            // Deletion failed
            console.log(path, dir, filename);
            callback('You have not succeeded in your quest');
        }
    });
}



module.exports = lib;

