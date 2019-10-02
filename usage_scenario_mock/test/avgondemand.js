const AvgOnDemand = artifacts.require("./AvgOnDemand.sol");

contract("UsageScenarioOne, eth gas reporter test", async accounts => {
  it("usage scenario one implement variant one ", async () => {
    const avgOnDemand = await AvgOnDemand.new();
    const addTransaction = await avgOnDemand.add(10);
    const addTransaction2 = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
    const avgTransaction2 = await avgOnDemand.calc();
  });

  it("usage scenario two implement variant one ", async () => {
    const avgOnDemand = await AvgOnDemand.new();
    const addTransaction = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.calc();
  });
});
