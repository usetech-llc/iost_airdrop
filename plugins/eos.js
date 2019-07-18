const PluginBase = require('../plugin_base');
var config = require('../config');

const got = require('got');
const urljoin = require('url-join');

class EOSPlugin extends PluginBase {

  constructor() {
    super();
    this._url = config.eosNode;
  }

  async getCurrentBlock() {
    const relativePath = "get_info";
    const args = {};

    const response = await got.get(urljoin(this._url, relativePath), args);
    return JSON.parse(response.body)['head_block_num'];
  }

  async getBlockTransactionAddresses(blockNum) {
    const relativePath = `get_block`;

    const args = {
      headers: {
        'Content-Type': 'application/json '
      },
      body: JSON.stringify({block_num_or_id: blockNum}),
    };
    const response = await got.post(urljoin(this._url, relativePath), args);

    var result = [];
    if (response) {
      const txList = JSON.parse(response.body)['transactions'];
      txList.forEach(function(e) {
        if (e.trx) {
          if (e.trx.transaction) {
            if (e.trx.transaction.actions) {
              e.trx.transaction.actions.forEach(function(a) {
                if (a.account)
                  result.push(a.account);
              })
            }
          }
        }
      })
    }

    return result;
  }

};

module.exports = EOSPlugin;
