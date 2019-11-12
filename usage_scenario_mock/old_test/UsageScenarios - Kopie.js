const AvgOnDemand = artifacts.require("./AvgOnDemand.sol");
const AvgOnDemandTwo = artifacts.require("./AvgOnDemandTwo.sol");

contract("First UsageScenario", async accounts => {
  it("Implement variant one", async () => {
    const avgOnDemand = await AvgOnDemand.new();
    const addTransaction = await avgOnDemand.add(10);
    const addTransaction2 = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
    const avgTransaction2 = await avgOnDemand.calc();
  });
  it("Implement variant two", async () => {
    const avgOnDemand = await AvgOnDemandTwo.new();
    const addTransaction = await avgOnDemand.add(10);
    const addTransaction2 = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
    const avgTransaction2 = await avgOnDemand.calc();
  });
});

contract("First UsageScenario", async accounts => {
  it("Implement variant two2", async () => {
    const avgOnDemand = await AvgOnDemandTwo.new();
    const addTransaction = await avgOnDemand.add(10);
    const addTransaction2 = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
    const avgTransaction2 = await avgOnDemand.calc();
  });
});

contract("Second UsageScenario", async accounts => {
  it("Implement variant one", async () => {
    const avgOnDemand = await AvgOnDemand.new();
    const addTransaction = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
  });

  it("Implement variant two", async () => {
    const avgOnDemand = await AvgOnDemandTwo.new();
    const addTransaction = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
  });
});
