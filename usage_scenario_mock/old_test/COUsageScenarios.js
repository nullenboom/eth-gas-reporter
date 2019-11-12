const AvgOnDemand = artifacts.require("./AvgOnDemand.sol");
const AvgOnDemandTwo = artifacts.require("./AvgOnDemandTwo.sol");

contract("ImplementVariantOne", async accounts => {
  it("UsageScenarioOne", async () => {
    const avgOnDemand = await AvgOnDemand.new();
    const addTransaction = await avgOnDemand.add(10);
    const addTransaction2 = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
    const avgTransaction2 = await avgOnDemand.calc();
  });
  it("UsageScenarioTwo", async () => {
    const avgOnDemand = await AvgOnDemand.new();
    const addTransaction = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
  });
});

contract("ImplementVariantTwo", async accounts => {
  it("UsageScenarioOne", async () => {
    const avgOnDemand = await AvgOnDemandTwo.new();
    const addTransaction = await avgOnDemand.add(10);
    const addTransaction2 = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
    const avgTransaction2 = await avgOnDemand.calc();
  });
  it("UsageScenarioTwo", async () => {
    const avgOnDemand = await AvgOnDemandTwo.new();
    const addTransaction = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
  });
});
