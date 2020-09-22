const { IncomingMessage, OutgoingMessage } = require('http');
const fs = require('fs');
const path = require('path');
const { mimeTypes } = require('./utils');

/**
 * 
 * @param {IncomingMessage} request 
 * @param {OutgoingMessage} response 
 */
module.exports = function (request, response) {
    
    let filePath = '.' + (/^\/static\//.test(request.url) ? request.url.replace(/^\/static\//, '/') : request.url);
    console.log('filePath', filePath)

    const extname = String(path.extname(filePath)).toLowerCase();

    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                response.writeHead(404);
                response.end();
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}