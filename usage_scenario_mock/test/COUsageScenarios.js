const AvgOnDemand = artifacts.require("./AvgOnDemand.sol");
const AvgOnDemandTwo = artifacts.require("./AvgOnDemandTwo.sol");

const calls = Math.floor(Math.random() * 10);

contract("avgOnDemand", async accounts => {
  it("UsageScenarioOne", async () => {
    const avgOnDemand = await AvgOnDemand.new();
    const addTransaction = await avgOnDemand.add(10);
    const addTransaction2 = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
    const avgTransaction2 = await avgOnDemand.calc();
    console.log("CALLS:" + calls);
  });
});

contract("avgOnDemand", async accounts => {
  it("UsageScenarioTwo", async () => {
    const avgOnDemand = await AvgOnDemand.new();
    const addTransaction = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
    console.log("CALLS:" + calls);
  });
});

contract("avgOnDemandTwo", async accounts => {
  it("UsageScenarioOne", async () => {
    const avgOnDemand = await AvgOnDemandTwo.new();
    const addTransaction = await avgOnDemand.add(10);
    const addTransaction2 = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
    const avgTransaction2 = await avgOnDemand.calc();
  });
});

contract("avgOnDemandTwo", async accounts => {
  it("UsageScenarioTwo", async () => {
    const avgOnDemand = await AvgOnDemandTwo.new();
    const addTransaction = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
  });
});
