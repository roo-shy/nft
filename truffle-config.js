require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "192.168.1.187",
      port: 7545,
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
