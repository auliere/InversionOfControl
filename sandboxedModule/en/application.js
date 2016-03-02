// File contains a small piece of the source to demonstrate main module
// of a sample application to be executed in the sandboxed context by
// another pice of code from `framework.js`. Read README.md for tasks.

// Print from the global context of application module
os = require('os')
console.log('From application global context');
for(var item in global) {
	if(typeof(global[item]) == "function") {
		var argList = global[item].toString()
			.replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
			.match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1];
		console.log("    " + item + ": <" + typeof(global[item]) + "(" + argList + ")>" );
	} else {
		console.log("    " + item + ": <" + typeof(global[item]) + ">" );
	}
}

console.log(os.homedir());

var timer1Id = setInterval(function(){ console.log("Using setInterval and util from app global context"); }, 1000);
var timer2Id = setTimeout(function(){ clearInterval(timer1Id) }, 10000);

module.exports = {
	somefunc: function(a, b, c) {
		// Print from the exported function context
	  console.log('From application exported function');	
	},
	a: 5,
	b: "Some string"
};
