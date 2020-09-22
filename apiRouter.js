const { IncomingMessage, OutgoingMessage } = require('http');
const connection = require('./database/connection');
const { URLHelper } = require('./utils');

/**
 * apiRouter
 * @param {IncomingMessage} request 
 * @param {OutgoingMessage} response 
 */
module.exports = function (request, response) {
    const Url = new URLHelper(`${process.env.APP_HOST}${request.url}`);
    const endpoint = Url.pathname.replace(/^\/api\//, '/');
    console.log('[HTTP 요청 apiRouter Handled]', endpoint);

    if (request.method === 'GET') {
        if (endpoint === '') {
            console.log('endpoint ', endpoint);
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end('API is healthy', 'utf-8');
        }
        
        if (endpoint === '/naver-callback') {
            console.log('LOG: naver-callback, request params: \n')
            console.log(Url.parseSearchParam({ omitEmpty: true }))
            // searchParams.get('code')
        }
    }
    
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('존재하지 않는 API 입니다.', 'utf-8');
}