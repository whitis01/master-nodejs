/**
 *  Primary file for the API
 *  @author - Isaac A. White
 */

// Dependencies

// Build up a server.
var http = require('http');
// Build up a SSL server.
var https = require('https');
// Parse the URL
var url  = require('url');
// Need to read files.
var fs = require('fs');
// Method to get the request payload.
var StringDecoder = require('string_decoder').StringDecoder;
// Pull in the current environment via the config.js file (in this directory).
var config = require('./config.js');
// Pull in the route handlers
var handlers = require('./lib/handlers');
// Pull in our helper methods
var helpValidate = require('./lib/helpers').parseJsonToObject;

var _data = require('./lib/data');

// Instantiate the HTTP server
var httpServer = http.createServer((req, res) => {
    unifiedServer(req,res);
});


// Create a server option to pull in the server key.
var httpsServerOptions = {
    'key'  : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem'),
};

// Instantiate the HTTPS server
var httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req,res);
});


// All servers come here for config, then call server.
var unifiedServer = (req, res) => {
    // Get the URL and parse it
    var parseURL = url.parse(req.url, true);

    // Get the Path
    var path = parseURL.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the Query String as an object.
    var queryString = parseURL.query;

    // Get the HTTP method.
    var method = req.method.toUpperCase();

    // Get the Headers as an object.
    var headers = req.headers;

    // Get request payload, if any. UTF-8 is the most common character set.
    var decoder = new StringDecoder('utf-8');
    // The request returns a stream. Create a buffer to hold the data.
    var bufferStream = '';
    // This is an event called ondata. When it executes, place the data in the string via callback function.
    // This function is not called if data is empty.

    req.on('data', (data) => {
        bufferStream = bufferStream + decoder.write(data);
    });
    // This is an event called onend. This will always be called, whether there is data or not.
    req.on('end', () => {
        bufferStream = bufferStream + decoder.end();
        var chosenHandler = typeof(router[trimmedPath]) !== "undefined" ? router[trimmedPath] : handlers.notFound;
        // Construct the data object to send to the handler.
        var data = {
            'trimmedPath' : trimmedPath,
            'queryString' : queryString,
            'method'  : method,
            'headers' : headers,
            'payload' : helpValidate(bufferStream),
        }
        // Call the chosen handler and route the request.
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler or default to 200.
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            // Use the payload called back by the handler or default to an empty object.
            payload = typeof(payload) === 'object' ? payload : {};

            // Convert the object to a string.
            var payloadString = JSON.stringify(payload);
            var dataString = JSON.stringify(data);

            // Inform client the format of the text to be returned in the response.
            res.setHeader('Content-type', 'application/json');
            // Send the error code in the header.
            res.writeHead(statusCode);

            // Send Response
            res.end(payloadString);

            logger('Returning this response: ' + statusCode + '\n', payloadString);
        });

        // Log request
        logger('Request Payload: ', bufferStream);
        logger('Request Headers\n', headers);
        logger('Request Method: ' + method + '\n\tRequest received for Path: ' + trimmedPath + '\n\tRequest query string object: ', queryString);
        logger('Decoded request received for Path: ' + decodeURI(trimmedPath));
    });

}

var logger = (message, objects = {}) => {
    var datetime = new Date(Date.now());
    var date = datetime.toDateString();
    var time = datetime.toTimeString();
    var logTime = date + ' | ' + time;
    objects = Object.keys(objects).length === 0 ? '' : objects;
    console.log(logTime + ' - ' + message, objects);
}

// Start server and listen on port set in config.
httpServer.listen(config.httpPort, () => {
    logger('The server is listening on I love you ' + config.httpPort + ' in ' + config.envName + ' mode.');
});

// Start server and listen on port set in config.
httpsServer.listen(config.httpsPort, () => {
    logger('The server is listening on I love you ' + config.httpsPort + ' in ' + config.envName + ' mode.');
});

// Define a request router.
var router = {
    'home'    : handlers.home,
    'hit-meh' : handlers.hitMeh,
    'ping' : handlers.hitMeh,
    'users' : handlers.users,
};
