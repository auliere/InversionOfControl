// Example showing us how the framework creates an environment (sandbox) for
// appication runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

// The framework can require core libraries
var fs = require('fs'),
    vm = require('vm'),
	util = require('util');


process.argc = process.argv.length;
// Print an error message if there are no parameters. First two params are node and framework.
if(process.argv.length < 3)
{
	console.log("Need at least 1 parameter, " + (process.argc - 2) + " provided");
}
else
{
	//Read and run every file in command line argument
	process.argv.shift();
	process.argv.shift();
	console.dir(process.argv);
	process.argv.forEach(function(item, id) {		
		// Create a hash and turn it into the sandboxed context which will be
		// the global context of an application
		var context = 
			{ 
				module: {}, 
				console: console, 
				setTimeout: 
				function(callback, timeout) {
					console.log("Function setTimeout was called with interval " + timeout + "ms");
					setTimeout(callback, timeout);
				}, 
				setInterval: setInterval,
				clearInterval: clearInterval,
				util: util
			};
		context.global = context;		
		var sandbox = vm.createContext(context);
		
		// Read an application source code from the file
		var fileName = './' + item + '.js';
		fs.readFile(fileName, function(err, src) {
			// We need to handle errors here
			if (err) {
				console.log("File not found");
			} else {
				// Run an application in sandboxed context
				var script = vm.createScript(src, fileName);
				script.runInNewContext(sandbox);
				// We can access a link to exported interface from sandbox.module.exports
				// to execute, save to the cache, print to console, etc.
			}
		});
	});
}
