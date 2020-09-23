const { IncomingMessage, OutgoingMessage } = require('http');
const connection = require('./database/connection');
const { URLHelper } = require('./utils');
const fetch = require('node-fetch');
const render = require('./render');

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
            return;
        }
        
        if (endpoint === '/naver/callback') {
            console.log('LOG: naver/callback, request params: \n')
            console.log(URLHelperInstance.queryStringToParams({ omitEmpty: true }));
            const queryParam = {
                grant_type: 'authorization_code',
                client_id: process.env.NAVER_CLIENT_ID,
                client_secret: process.env.NAVER_CLIENT_SECRET,
                code: URLHelperInstance.searchParams.get('code'),
                state: URLHelperInstance.searchParams.get('state')
            }
            try {
                // get token
                return fetch(`https://nid.naver.com/oauth2.0/token?${URLHelper.paramsToQueryString(queryParam)}`)
                    .then(getTokenResponse => getTokenResponse.json())
                    .then(getTokenResponse => {
                        if (getTokenResponse.error) {
                            console.error('Error', getTokenResponse);
                            response.writeHead(400, { 'Content-Type': 'text/plain' });
                            response.end(getTokenResponse.error_description, 'utf8');
                            return;
                        }
                        // fetch user profile
                        fetch(`https://openapi.naver.com/v1/nid/me`, {
                            headers: {'Authorization': `Bearer ${getTokenResponse.access_token}`}
                        })
                            .then(getProfileResponse => getProfileResponse.json())
                            .then(async getProfileResponse => {
                                response.setHeader('Set-Cookie', [
                                    `access_token=${getTokenResponse.access_token}`,
                                    `refresh_token=${getTokenResponse.refresh_token}`
                                ]);
                                // response.writeHead(200, { 'Content-Type': 'application/json' });
                                const content = await render('/index.html', {
                                    name: getProfileResponse.response.name
                                });
                                console.log('\n\n\n\ncontent\n\n\n\n\n', content)
                                response.setHeader('Content-Type', 'text/html');
                                response.end(content, 'utf-8');
                                // return;
                            })
                    })
                } catch (err) {
                    console.error('Catch', err)
                }
        }
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end(`Bad request with method: ${request.method}`, 'utf-8');
        return;
    }
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end(`Bad request. Method: ${request.method}`, 'utf-8');
}