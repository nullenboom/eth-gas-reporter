var AvgOnDemand = artifacts.require("./AvgOnDemand.sol");
var AvgOnDemandTwo = artifacts.require("./AvgOnDemandTwo.sol");


module.exports = function(deployer) {
  deployer.deploy(AvgOnDemand);
  deployer.deploy(AvgOnDemandTwo);
};
