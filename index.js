var plugin = require('shelljs/plugin');
var shell = require('shelljs');
var child = require('child_process');
var path = require('path');

var pathToSleepHelper = path.join(__dirname, 'sleepHelper.js');
var nodeSleep = shell.config.execPath + ' ' + pathToSleepHelper + ' ';
function execSleep(time) {
  if (shell.which('sleep')) {
    child.execSync('sleep ' + time);
  } else {
    child.execSync(nodeSleep + time);
  }
}

var sleepFunc;

try {
  /* eslint import/no-unresolved: 0 */
  var sleep = require('sleep');
  sleepFunc = sleep.sleep.bind(sleep);
  exports.nativeExt = sleep.sleep.bind(sleep);
} catch (e) {
  sleepFunc = execSleep;
}

function sleepImpl(options, waitTime) {
  var waitInt = parseInt(waitTime, 10);
  if (waitTime.toString() !== waitInt.toString()) {
    plugin.error('sleep time must be an integer');
  } else if (waitInt < 0) {
    plugin.error('negative numbers are not supported');
  }
  sleepFunc(waitInt);
  return '';
}

// Register the new plugin as a ShellJS command
plugin.register('sleep', sleepImpl, {
  cmdOptions: {},   // There are no supported options for this command
  shouldGlob: false,
});

exports.sleep = sleepImpl;
exports.execSleep = execSleep;
