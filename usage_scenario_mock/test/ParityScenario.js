const Binary = artifacts.require("./ParityBinary.sol");
const Modulo = artifacts.require("./ParityModulo.sol");

contract("Parity_Binary", async accounts => {
  it("UsageScenarioOne", async () => {
    const binary = await Binary.new();
    await binary.checkParity(10, 20);
  });
});

/*contract("Parity_Binary", async accounts => {
  it("UsageScenarioTwo", async () => {
    const binary = await Binary.new();
   await binary.modulo(10, 20);
   await binary.modulo(10, 20);
  });
});
*/
contract("Parity_Modulo", async accounts => {
  it("UsageScenarioOne", async () => {
    const modulo = await Modulo.new();
    await modulo.checkParity(10, 20);
  });
});

/*contract("Parity_Modulo", async accounts => {
  it("UsageScenarioTwo", async () => {
    const avgOnDemand = await Modulo.new();
   
  });
});
*/
