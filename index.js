var plugin = require('shelljs/plugin');
var shell = require('shelljs');
var child = require('child_process');
var path = require('path');

function sleepWithCommand(time) {
  child.execSync('sleep ' + time);
}

function sleepWithNode(time) {
  var pathToSleepHelper = path.join(__dirname, 'sleepHelper.js');
  var cmd = [
    JSON.stringify(shell.config.execPath),
    JSON.stringify(pathToSleepHelper),
    time,
  ].join(' ');
  child.execSync(cmd);
}

var sleepFunc;

try {
  /* eslint import/no-unresolved: 0 */
  var sleep = require('sleep');
  sleepFunc = sleep.sleep.bind(sleep);
  exports.nativeExt = sleep.sleep.bind(sleep);
} catch (e) {
  if (shell.which('sleep')) {
    sleepFunc = sleepWithCommand;
  } else {
    sleepFunc = sleepWithNode;
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
  cmdOptions: {}, // There are no supported options for this command
  allowGlobbing: false,
});

exports.sleep = sleepImpl;

// For testing only:
exports.sleepWithCommand = sleepWithCommand;
exports.sleepWithNode = sleepWithNode;
