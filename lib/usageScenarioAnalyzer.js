const log = console.log;
const UsageScenarioWatcher = require("./usageScenarioWatcher");

class GasUsageScenario {
  constructor(runner, config, sync) {
    const watchPerUsageScenario = new UsageScenarioWatcher(config);

    runner.on("start", () => {
      watchPerUsageScenario.data.initialize(config);
    });

    runner.on("suite", suite => {
      //watchPerUsageScenario.data.initializeUsageScenario(suite.title);
      //log(watchPerUsageScenario.data.usageScenarios);
    });

    runner.on("suite end", () => {});

    runner.on("pending", test => {});

    runner.on("test", test => {
      watchPerUsageScenario.beforeStartBlock = sync.blockNumber();
      watchPerUsageScenario.data.resetAddressCache();
      watchPerUsageScenario.data.initializeImplementVariant(
        test.parent.title,
        test.title
      );
      //log(watchPerUsageScenario.data);
    });

    runner.on("hook end", hook => {
      if (hook.title.includes("before each")) {
        watchPerUsageScenario.itStartBlock = sync.blockNumber() + 1;
      }
    });

    runner.on("pass", test => {
      watchPerUsageScenario.blocks(test.parent.title, test.title);

      //table.generate(watchPerUsage.data);
      //watch.resetData();
    });

    runner.on("fail", test => {});

    runner.on("end", () => {});
  }
}

module.exports = GasUsageScenario;
