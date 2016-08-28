var plugin = require('shelljs/plugin');
var shell = require('shelljs');
var child = require('child_process');

function execSleep(time) {
  var sleepCmd = process.platform === 'win32'
    ? 'timeout /t ' + time + ' /nobreak'
    : 'sleep ' + time; // actual unix sleep command

  if (child.execSync) {
    child.execSync(sleepCmd);
    exports.epsilon = 15;
  } else {
    shell.exec(sleepCmd, { silent: true });
    exports.epsilon = 180;
  }
}

var sleep;

try {
  /* eslint import/no-unresolved: 0 */
  sleep = require('sleep');
  exports.epsilon = 15;
} catch (e) {
  sleep = {
    sleep: execSleep,
  };
}

function sleepImpl(options, waitTime) {
  var waitInt = parseInt(waitTime, 10);
  if (waitTime.toString() !== waitInt.toString()) {
    plugin.error('sleep time must be an integer');
  } else if (waitInt < 0) {
    plugin.error('negative numbers are not supported');
  }
  sleep.sleep(waitInt);
  return '';
}

// Register the new plugin as a ShellJS command
plugin.register('sleep', sleepImpl, {
  cmdOptions: {},   // There are no supported options for this command
});

// Optionally, you can export the implementation of the command like so:
exports.sleep = sleepImpl;
exports.execSleep = execSleep;
