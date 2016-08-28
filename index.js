var plugin = require('shelljs/plugin');
var sleep = require('sleep');

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
