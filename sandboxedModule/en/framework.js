// Example showing us how the framework creates an environment (sandbox) for
// appication runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

// The framework can require core libraries
var fs = require('fs'),
    vm = require('vm'),
	util = require('util');
	path = require('path');
	
// A factory to create new sandboxes	
var sandboxFactory = {
	// Create a hash and turn it into the sandboxed context which will be
	// the global context of an application
	createSandbox: function(){
		var context = { 
				module: {}, 
				console: console,
				console: {
					log: function(message){
						var currentdate = new Date(); 
						var datetime = 	currentdate.getDate() + "/"
										+ (currentdate.getMonth()+1)  + "/" 
										+ currentdate.getFullYear() + " @ "  
										+ currentdate.getHours() + ":"  
										+ currentdate.getMinutes() + ":" 
										+ currentdate.getSeconds();					
						var interceptMessage = " <" + datetime + "> <" + path.basename(process.argv[2]) + "> " + message;
						console.log(interceptMessage);
						fs.appendFile('log', interceptMessage + "\n", (err) => {
							if (err) throw err;
						});
					}
				},
				setTimeout: function(callback, timeout) {
					console.log("Function setTimeout was called with interval " + timeout + "ms");
					setTimeout(callback, timeout);
				}, 
				setInterval: setInterval,
				clearInterval: clearInterval,
				util: util
			};
		context.global = context;		
		var sandbox = vm.createContext(context);
		return sandbox;
	}		
}

process.argc = process.argv.length;
// Print an error message if there are no parameters. First two params are node and framework.
if(process.argv.length < 3)
{
	console.log("Need at least 1 parameter, " + (process.argc - 2) + " provided");
}
else
{
	//Read and run every file in command line argument
	process.argv.slice(2).forEach(function(item, id) {
		// Read an application source code from the file
		var fileName = './' + item + '.js';
		fs.readFile(fileName, function(err, src) {
			// We need to handle errors here
			if (err) {
				console.log("File " + item + " not found");
			} else {
				// Run an application in sandboxed context
				var script = vm.createScript(src, fileName);
				var sandbox = sandboxFactory.createSandbox();
				script.runInNewContext(sandbox);
				// We can access a link to exported interface from sandbox.module.exports
				// to execute, save to the cache, print to console, etc.
				
				//Print a list of exported functions and variables
				for(var item in sandbox.module.exports) {
					if(typeof(sandbox.module.exports[item]) == "function") {
						var argList = sandbox.module.exports[item].toString()
							.replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
							.match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1];						
						for(var item in sandbox.module.exports[item].arguments) {
							argList = argList + (item + ", ");
						}
						console.log("    " + item + ": <" + typeof(sandbox.module.exports[item]) + "(" + argList + ")>" );
					} else {
						console.log("    " + item + ": <" + typeof(sandbox.module.exports[item]) + ">" );
					}
				}
			}			
		});
	});
}
