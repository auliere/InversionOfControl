// Wrapping function and interface example

var fs = require('fs'),
    vm = require('vm');

function cloneInterface(interfaceInstance) {
  var clone = {};
  for (var key in interfaceInstance) {
    clone[key] = interfaceInstance[key];
  }
  return clone;
}

  
function wrapFunction(fnName, fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    console.log('Call: ' + fnName);
    console.dir(args);
    return fn.apply(undefined, args);
  }
}

function addition(x, y) {
  return x+y; 
}

console.log(addition(2,3));

console.log(wrapFunction('Addition', function wrapper(x, y){
    console.log("Hah");
    return addition(x, y);
  })(2,3));
	
// Create a hash for application sandbox
var context = {
  module: {},
  console: console,
  // Forward link to fs API into sandbox
  fs: cloneInterface(fs),
  // Wrapper for setTimeout in sandbox
  setTimeout: function(callback, timeout) {
    // Logging all setTimeout calls
    console.log(
      'Call: setTimeout, ' +
      'callback function: ' + callback.name + ', ' +
      'timeout: ' + timeout
    );
    setTimeout(function() {
      // Logging timer events before application event
      console.log('Event: setTimeout, before callback');
      // Calling user-defined timer event
      callback();
      console.log('Event: setTimeout, after callback');
    }, timeout);
  }
};

// Turn hash into context
context.global = context;
var sandbox = vm.createContext(context);

// Read an application source code from the file
var fileName = './application.js';
fs.readFile(fileName, function(err, src) {
  // Run an application in sandboxed context
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});
