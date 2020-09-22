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
    
    let filePath = './views' + request.url;
    if (filePath == './views/') filePath += 'index.html';

    const extname = String(path.extname(filePath)).toLowerCase();

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./views/404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
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