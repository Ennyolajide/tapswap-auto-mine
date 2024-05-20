const chalk = require('chalk');
const axios = require('axios');
const { urls, getHeaders } = require('./config');

function setToken(token) {
    return `Bearer ${token}`;
}

function buildTapData(taps){
    return { "taps": taps, "time": Date.now() }
}

function tap(token, taps, maxTap) {
    const data = buildTapData(taps);
    return axios.post(urls.tap, data, { headers: getHeaders(data, { Authorization: setToken(token) }) }).then((res) => {
        const { player } = res.data;
        player ? logTap(taps, player) : exitProcess();
        (player && player.energy <= maxTap) ? exitProcess() : false;
    }).catch((error) => {
        logError(error);
    });
}

function logInfo(obj) {
    console.log(
        'Full Name:', chalk.blue(obj.full_name),
        '| Coins:', chalk.yellow(obj.shares),
        '| Energy:', chalk.magenta(obj.energy),
        '| Turbo:', chalk.green(obj.boost[1].cnt),
        '| Refill:', chalk.cyan(obj.boost[0].energy)
    );
}

function logTap(taps, obj) {
    console.log(
        'Taping ...', 
        chalk.blue('->'),
        chalk.magenta(taps),
        chalk.green('\u2714'),
        '| Coins:', chalk.yellow(obj.shares),
        '| Energy:', chalk.magenta(obj.energy),
        // '| Turbo:', chalk.green(obj.boost[1].cnt),
        // '| Refill:', chalk.cyan(obj.boost[0].energy)
    );
}


function logError(error) {
    console.log(error.response ? error.response.data : error.request ? error.request : 'Error', error.message);
    process.exit();
}

function exitProcess() {
    console.log(
        chalk.red('Error collecting coin or coin mining completed. Exiting...')
    );
    process.exit(); //end the process
}

function logInterval(interval) {
    console.log(chalk.yellow(`Interval: ${interval} seconds`));
}

module.exports = { logInfo, tap, logError, exitProcess }
