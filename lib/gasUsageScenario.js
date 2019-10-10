const log = console.log;



class GasUsageScenario {
  constructor(runner) {
	runner.on("start", () => {
		console.log("Start")
	});
	 
	runner.on("suite", suite => {
		console.log("Suite start")
	});
	 
	runner.on("suite end", () => {
		console.log("Suite end")
	});
	
	runner.on("pending", test => {
		console.log("pending")
	});
	 
	runner.on("test", () => {
		console.log("test starting")
	}); 
	 
	runner.on("hook end", hook => {
		console.log("hook end")   
	});
	
	runner.on("pass", test => {
		console.log("pass")
	 });
	
	runner.on("fail", test => {
		console.log("fail")
	});

	runner.on("end", () => {
		 console.log("end")
	});
  }
}

module.exports = GasUsageScenario;
