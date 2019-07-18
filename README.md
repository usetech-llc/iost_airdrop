# Multichain airdrop

## Installation

```
npm install
```

## Configuration and Running

1. Select blockchain by uncommenting a plugin included in lastxmonths.js:
```
// Select blockchain to work with
const blockchain = new IOSTPlugin();
```

2. Enter block range in these lines of lastxmonths.js:
```
...
//const startBlock = 1;
const startBlock = 22000000;
const endBlock = 22894000;
var b = endBlock;
while (b >= startBlock) {
...
```

3. Run with node:
```
node lastxmonths.js
```
