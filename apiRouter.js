const { IncomingMessage, OutgoingMessage } = require('http');
const connection = require('./database/connection');
const { URLHelper } = require('./utils');
const fetch = require('node-fetch');

/**
 * apiRouter
 * @param {IncomingMessage} request 
 * @param {OutgoingMessage} response 
 */
module.exports = function (request, response) {
    const URLHelperInstance = new URLHelper(`${process.env.APP_HOST}${request.url}`);
    const endpoint = URLHelperInstance.pathname.replace(/^\/api\//, '/');
    console.log('[HTTP 요청 apiRouter Handled]', endpoint);

    if (request.method === 'GET') {
        if (endpoint === '') {
            console.log('endpoint ', endpoint);
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end('API is healthy', 'utf-8');
        }
        
        if (endpoint === '/naver-callback') {
            console.log('LOG: naver-callback, request params: \n')
            console.log(URLHelperInstance.queryStringToParams({ omitEmpty: true }));
            const queryParam = {
                grant_type: 'authorization_code',
                client_id: process.env.NAVER_CLIENT_ID,
                client_secret: process.env.NAVER_CLIENT_SECRET,
                code: URLHelperInstance.searchParams.get('code'),
                state: URLHelperInstance.searchParams.get('state')
            }
            fetch(`https://nid.naver.com/oauth2.0/token?${URLHelper.paramsToQueryString(queryParam)}`)
                .then(res => res.json())
                .then(data => {
                    // searchParams.get('code')
                    https://nid.naver.com/oauth2.0/token
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.end('R U Naver Login ? ~', 'utf-8');
                })
        }
    }
    
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('존재하지 않는 API 입니다.', 'utf-8');
}