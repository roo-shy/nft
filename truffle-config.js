require('babel-register');
require('babel-polyfill');

//gas is gas limit
// gasPrice is the price

module.exports = {
  networks: {
    development: {
      websockets: true,
      gas: 900000000,  // gas limit
      gasPrice: 1,
      host: "127.0.0.1",
      port: 8545,
      network_id: "5777" // Match any network id
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version:"0.7.4"
      // version:"0.8.0"

    }
  }
}
