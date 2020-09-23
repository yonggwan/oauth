const http = require('http');
const apiRouter = require('./apiRouter');
const publicRouter = require('./publicRouter');
const viewRouter = require('./viewRouter');

console.log('node ver: ' + process.version);

const port = process.env.port || 4000;

http.createServer(function (request, response) {
    console.log('[HTTP 요청]', request.url);

    if (/\/api[\/]?/.test(request.url))
        return apiRouter(request, response);

    if (/\/static[\/]?/.test(request.url))
        return publicRouter(request, response);

    return viewRouter(request, response);

}).listen(port);
console.log(`Server running at ${process.env.APP_HOST}:${port}`);