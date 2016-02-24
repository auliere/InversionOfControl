// File contains a small piece of the source to demonstrate main module
// of a sample application to be executed in the sandboxed context by
// another pice of code from `framework.js`. Read README.md for tasks.

// Print from the global context of application module
console.log('From application global context');
var timer1Id = setInterval(function(){ util.log("Using setInterval and util from app global context"); }, 1000);
var timer2Id = setTimeout(function(){ clearInterval(timer1Id) }, 10000);

module.exports = function() {
	// Print from the exported function context
  console.log('From application exported function');
};
