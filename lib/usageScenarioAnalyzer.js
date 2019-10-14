const log = console.log;
const UsageScenarioWatcher = require("./usageScenarioWatcher");

class GasUsageScenario {
  constructor(runner, config, table, sync) {
    const watchPerUsage = new UsageScenarioWatcher(config);

    runner.on("start", () => {
      watchPerUsage.data.initialize(config);
    });

    runner.on("suite", suite => {});

    runner.on("suite end", () => {});

    runner.on("pending", test => {});

    runner.on("test", () => {
      watchPerUsage.beforeStartBlock = sync.blockNumber();
      watchPerUsage.data.resetAddressCache();
    });

    runner.on("hook end", hook => {
      if (hook.title.includes("before each")) {
        watchPerUsage.itStartBlock = sync.blockNumber() + 1;
      }
    });

    runner.on("pass", test => {
      watchPerUsage.blocks();

      table.generate(watchPerUsage.data);
      watchPerUsage.resetData();
    });

    runner.on("fail", test => {});

    runner.on("end", () => {});
  }
}

module.exports = GasUsageScenario;
