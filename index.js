var plugin = require('shelljs/plugin');
var shell = require('shelljs');
var child = require('child_process');

function execSleep(time) {
  if (shell.which('sleep')) {
    var sleepCmd = 'sleep'; // actual unix sleep command
    if (child.execFileSync) {
      child.execFileSync(sleepCmd, [time]);
      exports.epsilon = 20;
    } else {
      shell.exec(sleepCmd + ' ' + time, { silent: true });
      exports.epsilon = 180;
    }
  } else {
    throw new Error('Unable to find `sleep` command');
  }
}

function busyWait(time) {
  var end = new Date().getTime() + (time * 1000);

  while (new Date().getTime() <= end) {
    // loop continuously, because Node can't sleep
  }
}

var sleepFunc;

try {
  /* eslint import/no-unresolved: 0 */
  var sleep = require('sleep');
  exports.epsilon = 15;
  sleepFunc = sleep.sleep.bind(sleep);
  exports.nativeExt = sleep.sleep.bind(sleep);
} catch (e) {
  if (shell.which('sleep')) {
    sleepFunc = execSleep;
  } else {
    sleepFunc = busyWait;
  }
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
exports.busyWait = busyWait;
