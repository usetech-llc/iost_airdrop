var fs = require('fs')

let addresses;

async function main() {

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
    console.log("No saved addresses found");
  }

}

main();
