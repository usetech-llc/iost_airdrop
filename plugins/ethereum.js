const PluginBase = require('../plugin_base');
var config = require('../config');

var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
const delay = require("delay");
var CryptoJS = require('crypto-js');
var BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 18, ROUNDING_MODE: BigNumber.ROUND_DOWN });

////////////////////////////////////////
// set the Web3 provider
if (typeof web3 !== 'undefined') {
    web3 = new Web3(config.web3ProviderUrl);
} else {
    // Use this for local UseTech node
    web3 = new Web3(new Web3.providers.HttpProvider(config.web3ProviderUrl));
}
////////////////////////////////////////


class EthereumPlugin extends PluginBase {

  async getCurrentBlock() {
    var currentBlock = await web3.eth.getBlockNumber();
    return currentBlock;
  }

  async getBlockTransactionAddresses(blockNum) {
    var result = [];
    var block = await web3.eth.getBlock(blockNum, true);
    if (block != null && block.transactions != null) {
      block.transactions.forEach(async function(e) {
        if (e.from)
          result.push(e.from);
        if (e.to)
          result.push(e.to);
      }) // block.transactions.forEach
    } // if (block != null && block.transactions != null)

    return result;
  }

};

module.exports = EthereumPlugin;
