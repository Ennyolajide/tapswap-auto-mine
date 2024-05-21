require('dotenv').config();
const { getRandom } = require('./utils');

const env = process.env;
const baseUrl = 'https://api.tapswap.ai/api';

const urls = {
    login: `${baseUrl}/account/login`,
    tap: `${baseUrl}/player/submit_taps`,
}

function buildAuthQuery() {
    return `query_id=${env.QUERY_ID}&user={"id":${env.USER_ID},"first_name":"${env.FIRST_NAME}","last_name":"${env.LAST_NAME}","username":"${env.USERNAME}","language_code":"${env.LANGUAGE_CODE}","allows_write_to_pm":${env.ALLOWS_WRITE_TO_PM}}&auth_date=${env.AUTH_DATE}&hash=${env.HASH}`;
}

function getHeaders(data = {}, headers = {}, ContentLength = null) {

    return {
        'x-cv': '1',
        'Accept': '*/*',
        'Sec-Fetch-Site': 'cross-site',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Sec-Fetch-Mode': 'cors',
        'Content-Type': 'application/json',
        'Origin': 'https://app.tapswap.club',
        'Content-Id': getRandom(12345, 98764321),
        'x-app': 'tapswap_server',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'https://app.tapswap.club/',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        ...headers
    };

}

module.exports = { urls, getHeaders, buildAuthQuery }
