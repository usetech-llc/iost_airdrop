class PluginBase {

  async getCurrentBlock() {
    throw Error("Not implemented");
  }

  async getBlockTransactionAddresses(blockNum) {
    throw Error("Not implemented");
  }

  async getBalance(address) {
    throw Error("Not implemented");
  }

}


module.exports = PluginBase;
