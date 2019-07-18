var fs = require('fs')
var EtherPlugin = require('./plugins/ethereum')
var IOSTPlugin = require('./plugins/iost')
var EOSPlugin = require('./plugins/eos')

///////////////////////////////////////////
// Select blockchain to work with
//const blockchain = new EtherPlugin();
const blockchain = new IOSTPlugin();
//const blockchain = new EOSPlugin();
///////////////////////////////////////////

let addresses;

async function getBalance(address) {
  let b = 0;
  try {
    b = await blockchain.getBalance(address);
  } catch (e) {
    console.log(`Can't retrieve balance for ${address}`);
  }
  return b;
}

async function main() {

  var currentBlock = await blockchain.getCurrentBlock();
  console.log(`Current block: ${currentBlock}`);

  // Restore set of addresses if it exists
  let addrJson;
  let addrArray = [];
  try {
    addrJson = fs.readFileSync('addresses.json','utf8');
  } catch (e) {
  }
  if (addrJson) {
    addrArray = JSON.parse(addrJson);
    console.log(`${addrArray.length} addresses were restored`);
  }

  // Filter
  let filtered = [];
  for (var i=0; i<addrArray.length; i++) {
    var bal = await getBalance(addrArray[i]);
    //console.log(`${addrArray[i]}: ${bal}`);
    if (bal > 0.1) filtered.push(addrArray[i]);

    if (i % 1000 == 999)
      console.log(`${i+1} addresses processed`);
  }

  console.log(`${filtered.length} filtered addresses found`);
  fs.writeFileSync("addresses_filtered.json", JSON.stringify(filtered));
}

main();
