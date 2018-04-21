require('dotenv').config();
require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = process.env.MNEMONIC;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    live: {
      provider: function() {
        return new HDWalletProvider(mnemonic, `https://mainnet.infura.io/${process.env.INFURA_API_KEY}`)
      },
      gas: 6e6,
      network_id: 1
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${process.env.INFURA_API_KEY}`)
      },
      gas: 6e6,
      network_id: 3
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/${process.env.INFURA_API_KEY}`)
      },
      gas: 6e6,
      network_id: 4
    },
    development: {
      host: "localhost",
      port: 8545,
      gas: 6e6,
      network_id: "*" // Match any network id
    }
  }
};