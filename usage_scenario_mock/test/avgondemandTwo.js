const AvgOnDemand = artifacts.require("./AvgOnDemandTwo.sol");

contract("UsageScenarioOne, eth gas reporter test", async accounts => {
  it("usage scenario one implement variant two ", async () => {
    const avgOnDemand = await AvgOnDemand.new();
    const addTransaction = await avgOnDemand.add(10);
    const addTransaction2 = await avgOnDemand.add(10);
    const avgTransaction = await avgOnDemand.getAvg();
    const avgTransaction2 = await avgOnDemand.getAvg();
  });

  it("usage scenario two implement variant one ", async () => {
    const avgOnDemand = await AvgOnDemand.new();
    const addTransaction = await avgOnDemand.add(10);

    const avgTransaction = await avgOnDemand.getAvg();
  });
});
