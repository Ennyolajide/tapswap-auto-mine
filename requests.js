const chalk = require('chalk');
const axios = require('axios');
const { urls, getHeaders } = require('./config');
const { AbortController } = require('abort-controller');

function setToken(token) {
    return `Bearer ${token}`;
}

function buildTapData(taps){
    return { "taps": taps, "time": Date.now() }
}

// async function tap(token, taps, maxTap) {
//     const data = buildTapData(parseInt(taps));
//     return axios.post(urls.tap, data, { headers: getHeaders(data, { Authorization: setToken(token) }) }).then((res) => {
//         const { player } = res.data;
//         player ? logTap(taps, player) : exitProcess();
//         (player && player.energy <= maxTap) ? exitProcess() : false;
//     }).catch((error) => {
//         if (error.code === 'ECONNRESET') {
//             console.log('Server Reject Request');
//             tap(token, taps, maxTap);
//         }else{
//             logError(error);
//         }
//     });
// }

async function tap(token, taps, maxTap) {
  const data = buildTapData(parseInt(taps));
  let retries = 3; // adjust the number of retries as needed
  let delay = 500; // adjust the delay between retries as needed

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 30000); // 30 seconds timeout

  while (retries > 0) {
    try {
      const response = await axios.post(urls.tap, data, {
        headers: getHeaders(data, { Authorization: setToken(token) }),
        signal: abortController.signal,
      });
      const { player } = response.data;
      logTap(taps, player);
      if (player && player.energy <= maxTap) {
        exitProcess();
      }
      break; // exit the loop on success
    } catch (error) {
      if (error.code === 'ECONNRESET') {
        console.log('Server Reject Request');
      } else if (error.name === 'AbortError') {
        console.log('Request cancelled due to timeout');
      } else {
        retries--;
        console.log(`Error: ${error.message}. Retries left: ${retries}`);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  if (retries === 0) {
    logError(new Error('Maximum retries reached'));
  }

  clearTimeout(timeoutId);
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
