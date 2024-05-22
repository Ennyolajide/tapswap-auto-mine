require('dotenv').config();
const axios = require('axios');
const { taps, interval } = require('./utils.js');
const { urls, getHeaders, buildAuthQuery } = require('./config');
const { logInfo, tap, logError, exitProcess } = require('./requests');

const data = {
    init_data: buildAuthQuery(),
    referrer: "",
    bot_key: "app_bot_0"
};

const env = process.env;
const maxTap = env.MAX_CLICK;


axios.post(urls.login, data, { headers: getHeaders(data) })
    .then((res) => {
        const { player, access_token } = res.data;
        const token = access_token ?? null;
        (token || player) ? logInfo(player) : exitProcess;

        async function handleTap() {
            token ? tap(token, taps(env), maxTap) : exitProcess;
            token ? setTimeout(handleTap, interval(env)) : exitProcess;
        }

        handleTap(); // Initial call
    })
    .catch(error => {
        logError(error)
    });
