/* globals describe, it, beforeEach, afterEach */

var pluginSleep = require('..');
var shell = require('shelljs');

require('should');

function assertApproxEqual(val1, val2) {
  var epsilon = process.env.CI ? 40 : 10; // CI tends to run slower
  var diff = Math.abs(val1 - val2);
  try {
    (diff <= epsilon).should.be.ok();
  } catch (e) {
    var msg = 'took ' + val1 + ' milliseconds but expected ' + val2 + '\u00B1' +
      epsilon + ' milliseconds';
    throw new Error(msg);
  }
}

describe('plugin-sleep', function () {
  var oldConsoleError;
  beforeEach(function () {
    // override console.error() to cover up common.error() calls
    oldConsoleError = console.error;
    console.error = function () { };
  });

  afterEach(function () {
    console.error = oldConsoleError;
  });

  it('gets added to the shelljs instance', function () {
    shell.sleep.should.be.type('function');
  });

  it('does not override other commands or methods', function () {
    shell.cp.should.be.type('function');
    shell.mv.should.be.type('function');
    shell.ls().should.have.property('toEnd');
    shell.ls().should.have.property('grep');
    shell.ls().should.have.property('sed');
  });

  it('exports the plugin implementation', function () {
    /*
     * A plugin author can also export the implementation of their commands
     */
    pluginSleep.should.be.type('object');
    pluginSleep.should.have.property('sleep');
    pluginSleep.sleep.should.be.type('function');
  });

  it('does not accept options/flags', function () {
    var ret = shell.sleep('-f', 1);
    ret.code.should.equal(1);
    ret.stdout.should.equal('');
    var errorMsg = 'sleep: option not recognized: f';
    ret.stderr.should.equal(errorMsg);
    shell.error().should.equal(errorMsg);
  });

  it('works for 0 seconds', function () {
    var start = new Date();
    var ret = shell.sleep(0);
    var end = new Date();
    assertApproxEqual(end - start, 0);
    ret.code.should.equal(0);
    ret.stdout.should.equal('');
  });

  it('works for 1 second', function () {
    var start = new Date();
    var ret = shell.sleep(1);
    var end = new Date();
    assertApproxEqual(end - start, 1000);
    ret.code.should.equal(0);
    ret.stdout.should.equal('');
  });

  it('works for 2 seconds', function () {
    this.timeout(3000);
    var start = new Date();
    var ret = shell.sleep(2);
    var end = new Date();
    assertApproxEqual(end - start, 2000);
    ret.code.should.equal(0);
    ret.stdout.should.equal('');
  });

  it('rejects negative numbers', function () {
    var ret = shell.sleep(-1);
    ret.code.should.equal(1);
    var errorMsg = 'sleep: negative numbers are not supported';
    ret.stdout.should.equal('');
    ret.stderr.should.equal(errorMsg);
    shell.error().should.equal(errorMsg);
  });

  it('rejects non-integer arguments', function () {
    var ret = shell.sleep('hi there');
    ret.code.should.equal(1);
    var errorMsg = 'sleep: sleep time must be an integer';
    ret.stdout.should.equal('');
    ret.stderr.should.equal(errorMsg);
    shell.error().should.equal(errorMsg);

    ret = shell.sleep(2.3);
    ret.code.should.equal(1);
    ret.stdout.should.equal('');
    ret.stderr.should.equal(errorMsg);
    shell.error().should.equal(errorMsg);
  });

  it('allows string arguments', function () {
    var start = new Date();
    var ret = shell.sleep('1');
    var end = new Date();
    assertApproxEqual(end - start, 1000);
    ret.code.should.equal(0);
    ret.stdout.should.equal('');
  });
});
