require('babel-register');
require('babel-polyfill');
const { alchemyApiKey, mnemonic } = require('./secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');
//gas is gas limit
// gasPrice is the price

module.exports = {
  networks: {
    development: {
      websockets: true,
      gas: 99000000,  // gas limit
      gasPrice: 1,
      host: "127.0.0.1",
      port: 8545,
      network_id: "5777" // Match any network id
    },
   ropsten: {
         provider: () => new HDWalletProvider(`apart frequent rabbit leisure credit earth report faint assist defy now fashion`, `https://ropsten.infura.io/v3/4499efec5f8f4aacaf7988bac139d9d3`,1),
         network_id: 3,       // Ropsten's id
         gas: 7000000 ,        // Ropsten has a lower block limit than mainnet
         confirmations: 2,    // # of confs to wait between deployments. (default: 0)
         timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
         skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version:"0.7.4",
      setttings: {
        optimizer: {
          enabled: true,
          runs: 1
        }
      }
    }
  }
}
