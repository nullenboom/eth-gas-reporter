# eth-gas-reporter

# !WARNING!: THIS REPO IS NO LONGER MANAGED, WILL BE DELETED IN THE NEAR FUTURE

[![npm version](https://badge.fury.io/js/eth-gas-reporter.svg)](https://badge.fury.io/js/eth-gas-reporter)
[![Build Status](https://travis-ci.org/cgewecke/eth-gas-reporter.svg?branch=master)](https://travis-ci.org/cgewecke/eth-gas-reporter)
[![Codechecks](https://raw.githubusercontent.com/codechecks/docs/master/images/badges/badge-default.svg?sanitize=true)](https://codechecks.io)
[![buidler](https://buidler.dev/buidler-plugin-badge.svg?1)](https://github.com/cgewecke/buidler-gas-reporter)

**A Mocha reporter for Ethereum test suites:**

- Gas usage per unit test.
- Metrics for method calls and deployments.
- National currency costs of deploying and using your contract system.
- CI integration with [codechecks](http://codechecks.io)
- Simple installation for Truffle and Buidler

### Example output

![Screen Shot 2019-06-24 at 4 54 47 PM](https://user-images.githubusercontent.com/7332026/60059336-fa502180-96a0-11e9-92b8-3dd436a9b2f1.png)

### Installation and Config

**[Truffle](https://www.trufflesuite.com/docs)**

```
npm install --save-dev eth-gas-reporter
```

```javascript
/* truffle-config.js */
module.exports = {
  networks: { ... },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : { ... } // See options below
  }
};
```

**[Buidler](https://buidler.dev)**

```
npm install --save-dev buidler-gas-reporter
```

```javascript
/* buidler.config.js */
usePlugin('buidler-gas-reporter');

module.exports = {
  networks: { ... },
  gasReporter: { ... } // See options below
};
```

**Other**

This reporter should work with any build platform that uses Mocha and
connects to an Ethereum client running as a separate process. There's more on advanced use cases
[here](https://github.com/cgewecke/eth-gas-reporter/blob/master/docs/advanced.md).

### Continuous Integration (Travis and CircleCI)

This reporter comes with a [codechecks](http://codechecks.io) CI integration that
displays a pull request's gas consumption changes relative to its target branch in the Github UI.
It's like coveralls for gas. The codechecks service is free for open source and maintained by MakerDao engineer [@krzkaczor](https://github.com/krzkaczor).

Complete [set-up guide here](https://github.com/cgewecke/eth-gas-reporter/blob/master/docs/codechecks.md) (it's easy).

![Screen Shot 2019-06-18 at 12 25 49 PM](https://user-images.githubusercontent.com/7332026/59713894-47298900-91c5-11e9-8083-233572787cfa.png)

### Options

| Option            | Type                   | Default                     | Description                                                                                                                                                                               |
| ----------------- | ---------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| currency          | _String_               | 'EUR'                       | National currency to represent gas costs in. Exchange rates loaded at runtime from the `coinmarketcap` api. Available currency codes can be found [here](https://coinmarketcap.com/api/). |
| gasPrice          | _Number_               | (varies)                    | Denominated in `gwei`. Default is loaded at runtime from the `eth gas station` api                                                                                                        |
| outputFile        | _String_               | stdout                      | File path to write report output to                                                                                                                                                       |
| noColors          | _Boolean_              | false                       | Suppress report color. Useful if you are printing to file b/c terminal colorization corrupts the text.                                                                                    |
| onlyCalledMethods | _Boolean_              | true                        | Omit methods that are never called from report.                                                                                                                                           |
| rst               | _Boolean_              | false                       | Output with a reStructured text code-block directive. Useful if you want to include report in RTD                                                                                         |
| rstTitle          | _String_               | ""                          | Title for reStructured text header (See Travis for example output)                                                                                                                        |
| showTimeSpent     | _Boolean_              | false                       | Show the amount of time spent as well as the gas consumed                                                                                                                                 |
| excludeContracts  | _String[]_             | []                          | Contract names to exclude from report. Ex: `['Migrations']`                                                                                                                               |
| src               | _String_               | "contracts"                 | Folder in root directory to begin search for `.sol` files. This can also be a path to a subfolder relative to the root, e.g. "planets/annares/contracts"                                  |
| url               | _String_               | `web3.currentProvider.host` | RPC client url (ex: "http://localhost:8545")                                                                                                                                              |
| proxyResolver     | _Function_             | none                        | Custom method to resolve identity of methods managed by a proxy contract.                                                                                                                 |
| artifactType      | _Function_ or _String_ | "truffle-v5"                | Compilation artifact format to consume. (See [advanced use](https://github.com/cgewecke/eth-gas-reporter/blob/master/docs/advanced.md).)                                                  |

### Advanced Use

An advanced use guide is available [here](https://github.com/cgewecke/eth-gas-reporter/blob/master/docs/advanced.md). Topics include:

- Getting accurate gas data when using proxy contracts like EtherRouter or ZeppelinOS.
- Configuring the reporter to work with non-truffle, non-buidler projects.

### Example Reports

- [gnosis/gnosis-contracts](https://github.com/cgewecke/eth-gas-reporter/blob/master/docs/gnosis.md)
- [windingtree/LifToken](https://github.com/cgewecke/eth-gas-reporter/blob/master/docs/lifToken.md)

### Usage Notes

- Requires Node >= 8.
- You cannot use `ganache-core` as an in-process provider for your test suite. The reporter makes sync RPC calls
  while collecting data and your tests will hang unless the client is launched as a separate process.
- Method calls that throw are filtered from the stats.
- Contracts that are only ever created by other contracts within Solidity are not shown in the deployments table.

### Contributions

Feel free to open PRs or issues. There is an integration test and one of the mock test cases is expected to fail. If you're adding an option, you can vaildate it in CI by adding it to the mock options config located [here](https://github.com/cgewecke/eth-gas-reporter/blob/master/mock/config-template.js#L13-L19).

### Credits

All the ideas in this utility have been borrowed from elsewhere. Many thanks to:

- [@maurelian](https://github.com/maurelian) - Mocha reporting gas instead of time is his idea.
- [@cag](https://github.com/cag) - The table borrows from / is based his gas statistics work for the Gnosis contracts.
- [Neufund](https://github.com/Neufund/ico-contracts) - Block limit size ratios for contract deployments and euro pricing are borrowed from their `ico-contracts` test suite.

### Contributors

- [@cgewecke](https://github.com/cgewecke)
- [@rmuslimov](https://github.com/rmuslimov)
- [@area](https://github.com/area)
- [@ldub](https://github.com/ldub)
- [@ben-kaufman](https://github.com/ben-kaufman)
- [@wighawag](https://github.com/wighawag)
- [@ItsNickBarry](https://github.com/ItsNickBarry)
- [@krzkaczor](https://github.com/krzkaczor)
- [@ppoliani](https://github.com/@ppoliani)
- [@gnidan](https://github.com/gnidan)
