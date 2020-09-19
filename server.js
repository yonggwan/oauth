const http = require('http');
const fs = require('fs');
const path = require('path');
const { mimeTypes } = require('./utils');
const port = 4000;

http.createServer(function (request, response) {
    console.log('request ', request.url);

    let filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './views/index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        console.log(error, content)
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

}).listen(port);
console.log(`Server running at http://127.0.0.1:${port}/`);