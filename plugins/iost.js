const PluginBase = require('../plugin_base');
var config = require('../config');

const got = require('got');
const urljoin = require('url-join');

class IOSTPlugin extends PluginBase {

  constructor() {
    super();
    this._url = config.iostNode;
  }

  async getCurrentBlock() {
    const relativePath = "getChainInfo";
    const args = {};

    const response = await got.get(urljoin(this._url, relativePath), args);
    return JSON.parse(response.body)['head_block'];
  }

  async getBlockTransactionAddresses(blockNum) {
    const relativePath = `getBlockByNumber/${blockNum}/true`;

    const args = {};
    const response = await got.get(urljoin(this._url, relativePath), args);

    var result = [];
    if (response) {
      const txList = JSON.parse(response.body)['block']['transactions'];
      txList.forEach(function(e) {
        if (e.publisher)
          result.push(e.publisher);
      })
    }

    return result;
  }

  async getBalance(address) {
    const relativePath = `getAccount/${address}/true`;

    const args = {};
    const response = await got.get(urljoin(this._url, relativePath), args);

    let result = 0;
    if (response) {
      result = JSON.parse(response.body)['balance'];
    }

    return result;
  }

};

module.exports = IOSTPlugin;
