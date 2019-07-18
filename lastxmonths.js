var fs = require('fs')
var EtherPlugin = require('./plugins/ethereum')
var IOSTPlugin = require('./plugins/iost')
var EOSPlugin = require('./plugins/eos')

const blockLimit = 1;
//const concurrencyLimit = 100;
const concurrencyLimit = -100;

///////////////////////////////////////////
// Select blockchain to work with
//const blockchain = new EtherPlugin();
const blockchain = new IOSTPlugin();
//const blockchain = new EOSPlugin();
///////////////////////////////////////////

let addresses;

async function analyseBlock(blockNum) {
  var txList = await blockchain.getBlockTransactionAddresses(blockNum);
  for (var i=0; i<txList.length; i++)
    addresses.add(txList[i]);
}

function handleRejection(p) {
    return p.catch(err=> ({ error: err }));
}

async function main() {

  var currentBlock = await blockchain.getCurrentBlock();
  console.log(`Current block: ${currentBlock}`);

  // Restore set of addresses if it exists
  let addrJson;
  try {
    addrJson = fs.readFileSync('addresses.json','utf8');
  } catch (e) {
  }
  if (addrJson) {
    const addrArray = JSON.parse(addrJson);
    addresses = new Set(addrArray);
    console.log(`${addresses.size} addresses were restored`);
  } else {
    addresses = new Set();
  }


  //const startBlock = currentBlock - blockLimit;
  //const startBlock = 1;
  const startBlock = 22000000;
  const endBlock = 22894000;
  //var b = startBlock;
  var b = endBlock;
  //while (b <= endBlock) {
  while (b >= startBlock) {

    var tasks = [];
    //for (var i=0; i<concurrencyLimit; i++) {
    for (var i=0; i>concurrencyLimit; i--) {
      tasks.push(analyseBlock(b+i));
      if (b+i > endBlock) break;
    }
    b += concurrencyLimit;
    if (b % 1000 == 0) {
      console.log(`Block: ${b}, Address count: ${addresses.size}`);
    }

    if (b % 1000 == 0) {
      fs.writeFileSync("addresses.json", JSON.stringify(Array.from(addresses)))
      //console.log(JSON.stringify(Array.from(addresses)));
    }

    await Promise.all(tasks.map(handleRejection));
  }
}

main();
