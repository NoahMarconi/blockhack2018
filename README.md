# blockhack2018


# TODO:

  - [x] Raw data to IPFS
  - [x] Raw data to merkle root
  - [x] Publish root and IPFS hash
  - [x] Read IPFS data and get merkle proof
  - [ ] Exercise permissions


# Team Merk

Using Merkle Roots to make large state updates on the public chain encompassed in a single root hash.

## Problem

Smart Contract development on the public blockchain is unlike other paradigms. Storage is not cheap by any stretch of the imagination and should be used as infrequently as possible.

Data intensive use cases, such as suply chain management or even access management for a large organization are non starters due to storage costs. 

## Solution

We build off of Richard Moores [Merkle AirDrops](https://blog.ricmoo.com/merkle-air-drops-e6406945584d) and introduce two novel additions:

  1. Pair with IPFS storage for data persistance;
  2. Demonstrate a new use case.

The specific use case we demonstrate is updating permissions, i.e. access control, for any number of parties, without publishing thier addresses to the public chain. Should permissions change, a single root hash is published to the smart contract along with the IPFS hash of the latest dataset.

The publishing of both hashes means the smart contract is always able to respond to the latest permission structure and users are always able to obtain thier merkle proofs from the IPFS dataset.


## Usage

We assume raw data is in JSON format structured as shown here:

```{json}
[
    { "address": "0x5a10c2afdbbddd6374318ff754dc1f1852403e2c", "permission": 1 },
    { "address": "0xcf0aa32424fc4cb0e0b6ce34bc5134f2875c068a", "permission": 0 },
    { "address": "0xe8570478ea019edf1deaf114f9545282075bcdeb", "permission": 0 },
    { "address": "0x04cb2f244c974e8607ce25c80860234add63fcc3", "permission": 1 },
    { "address": "0xdf4271fc55e4eca22831543370b2ffda3a0672fe", "permission": 0 },
    { "address": "0xdeb29b6cd55de7c17d1644db71b693f091481bfc", "permission": 0 },
    { "address": "0x770d5125d8eb0fb9851585d55845b782e6769038", "permission": 1 },
    { "address": "0x2d84b2c1512c45f10cc147978deaba04137bae6b", "permission": 1 },
    { "address": "0x1bb6893e787d02ecc4270d87005f65f3a6390820", "permission": 0 },
    { "address": "0xeb4711fa1c9faa6adee37566965fc8f239b0f00c", "permission": 1 }
]
```

In our demonstration, 1 is and admin an 0 is view only access. However, any range of permission schemes can be supported.

### Raw Data to IPFS

The `save` command saves the raw data to IPFS.

In the project directory run `node bin/merk-tools.js save ./testData.json` and the IPFS hash is logged to the console:

```
$ node bin/merk-tools.js save ./testData.json

    Saving ./testData.json to IPFS
added QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG testData.json
```

### IPFS Data to Merkle Root

The `merkle-root` command computes the merkle root hash from the dataset stored on IPFS.

In the project directory run `node bin/merk-tools.js merkle-root QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG` ensuring the hash is the one returned when you ran the `save` command.

```
$ node bin/merk-tools.js merkle-root QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG

    Getting QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG from IPFS

    Computed Merkle Root:
    0x893598180931f55c2e4d0ad638fb258455356f9c4177d8340c41ddf756a26222
```

### Publish to Smart Contract

The `publish` command persists the merkle root hash and the IPFS hash to the relevant smart contract.

```
$ node bin/merk-tools.js publish 0x893598180931f55c2e4d0ad638fb258455356f9c4177d8340c41ddf756a26222 QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG

    Publishing Merkle Root: 0x893598180931f55c2e4d0ad638fb258455356f9c4177d8340c41ddf756a26222
    Publishing IPFS Hash: QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG
Using network 'development'.

    rootHash set to: 0x893598180931f55c2e4d0ad638fb258455356f9c4177d8340c41ddf756a26222
    ipfsHash set to: QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG
```
The `set to:` confirmations that are logged read from the chain confirming that the hashes have been correctly set.

### Get Merkle Proof

The `merkle-proof` command computes the merkle proof from a particular address. As there can be multiple permissions per address, an index is required as input instead of the address.

```
$ node bin/merk-tools.js merkle-proof QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG 6

    Getting QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG from IPFS

    Computed Merkle Proof:
    0xc9f9fe58366731a2330cc5f4069e0f30a77559cc51443804af0a0e483fd85765,0x4e2eecf11ba0a8c4107fc693c609f8ec16eea441313f44d49f080f8e37a3dda2,0xd2631027d84926112b37abf1716adba457523111b869b650c90fe803b02888d3,0xff58eb23a3139593da470709976eed92196bfb94085c3627c82a1287aa2f4175
```



### Verify

The `verify` command verifies that a partifular address is an admin. Verification relies on the merkle proof to determine permission level.


```
$ node bin/merk-tools.js verify 6 0x770d5125d8eb0fb9851585d55845b782e6769038 1 "[\"0xc9f9fe58366731a2330cc5f4069e0f30a77559cc51443804af0a0e483fd85765\",\"0x4e2eecf11ba0a8c4107fc693c609f8ec16eea441313f44d49f080f8e37a3dda2\",\"0xd2631027d84926112b37abf1716adba457523111b869b650c90fe803b02888d3\",\"0xff58eb23a3139593da470709976eed92196bfb94085c3627c82a1287aa2f4175\"]"
    Verifying permission == 1
    For address: 0x770d5125d8eb0fb9851585d55845b782e6769038
Using network 'development'.

    Index: 6
    Address: 0x770d5125d8eb0fb9851585d55845b782e6769038
    Permission: 1
    Proof: 0xc9f9fe58366731a2330cc5f4069e0f30a77559cc51443804af0a0e483fd85765,0x4e2eecf11ba0a8c4107fc693c609f8ec16eea441313f44d49f080f8e37a3dda2,0xd2631027d84926112b37abf1716adba457523111b869b650c90fe803b02888d3,0xff58eb23a3139593da470709976eed92196bfb94085c3627c82a1287aa2f4175
    Is admin: true
```


And it works! This address coupled with its merkle proof is confirmed to have admin level permissions.





###### Testing 

Raw data:

```
[
    { "address": "0x5a10c2afdbbddd6374318ff754dc1f1852403e2c", "permission": 1 },
    { "address": "0xcf0aa32424fc4cb0e0b6ce34bc5134f2875c068a", "permission": 0 },
    { "address": "0xe8570478ea019edf1deaf114f9545282075bcdeb", "permission": 0 },
    { "address": "0x04cb2f244c974e8607ce25c80860234add63fcc3", "permission": 1 },
    { "address": "0xdf4271fc55e4eca22831543370b2ffda3a0672fe", "permission": 0 },
    { "address": "0xdeb29b6cd55de7c17d1644db71b693f091481bfc", "permission": 0 },
    { "address": "0x770d5125d8eb0fb9851585d55845b782e6769038", "permission": 1 },
    { "address": "0x2d84b2c1512c45f10cc147978deaba04137bae6b", "permission": 1 },
    { "address": "0x1bb6893e787d02ecc4270d87005f65f3a6390820", "permission": 0 },
    { "address": "0xeb4711fa1c9faa6adee37566965fc8f239b0f00c", "permission": 1 }
]
```

Hashes:

```
[ '0xcca476cd0be4e945376bd7e3899136574726b9b587dc5801974f9a1aeaa0be3c',
  '0xb18996966b9ba8f7b20ef1ddd3869fa011ccdad71e1b39575929deb7a5ff4a4d',
  '0x87c774c905cc558fe459d6448dce65940689f0c6e693b62287ddf825945f3184',
  '0xc8be72acbf8eba5486fd9261a6056856b432b6cdc97fb625e0cd3ea2bac7f2fd',
  '0xe3f9d19da85727b4b6d34bf596ae0e65b5c0e48ddfc75d384d3903e7dd9bc241',
  '0x0b93d849aeccd02c809789050ce753171abef866b50436de12b40daa244f2fed',
  '0x5936077b0e668efe22c56f5350c2a4801b8ead5059bfded08adcc837e5393014',
  '0xc9f9fe58366731a2330cc5f4069e0f30a77559cc51443804af0a0e483fd85765',
  '0x29c4ee2fb2040e2a6db3f4de4815228a1fea444611d1db1078f9a8249598e928',
  '0x1b955cfcb771cf027a01605cee78b7a6c3582259e87c2353530a9e8740816814' ]
```

```
[ '0xd8e9684cd4acd0e28df17a71c0c6b1a2317bc3b6a6530bcf0af108ea80274001',
  '0x34c284d67383807092c6add3186328b382b1164975f5387a6e32ca5962ac6f6c',
  '0x4e2eecf11ba0a8c4107fc693c609f8ec16eea441313f44d49f080f8e37a3dda2',
  '0xe66e5856bdbdb04a5f8925b181ffd5d7f7fdf390926f65fc001c1dcb427034d2',
  '0x56af6213ac959c19f794c3df00dc3c9c6ae27a542ea6f66606334037fc90b08c' ]
```

```
[ '0xd2631027d84926112b37abf1716adba457523111b869b650c90fe803b02888d3',
  '0x871e8e7820620e7a1fea87576d8387e2ca1d20754964dfe4b22d0757544a3ccf',
  '0x074516d68e605290ad5494b58848feb36a12fb4cca6a875d9725393b576c441c' ]
```

```
[ '0x4d4267e6439f907d4330fb945a7c8ff75b65533d9edc54ebdefb7c56f33820f3',
  '0xff58eb23a3139593da470709976eed92196bfb94085c3627c82a1287aa2f4175' ]
```

Root:

```
[ '0x893598180931f55c2e4d0ad638fb258455356f9c4177d8340c41ddf756a26222' ]
```


```{js}
merk.utils.checkMerkleProof(0, "0xcca476cd0be4e945376bd7e3899136574726b9b587dc5801974f9a1aeaa0be3c", ["0xb18996966b9ba8f7b20ef1ddd3869fa011ccdad71e1b39575929deb7a5ff4a4d","0x34c284d67383807092c6add3186328b382b1164975f5387a6e32ca5962ac6f6c","0x871e8e7820620e7a1fea87576d8387e2ca1d20754964dfe4b22d0757544a3ccf","0xff58eb23a3139593da470709976eed92196bfb94085c3627c82a1287aa2f4175"], "0x893598180931f55c2e4d0ad638fb258455356f9c4177d8340c41ddf756a26222")
```

```
var merk = require('./index.js');
```

```
var leaves = merk.utils.hash([
    { "address": "0x5a10c2afdbbddd6374318ff754dc1f1852403e2c", "permission": 1 },
    { "address": "0xcf0aa32424fc4cb0e0b6ce34bc5134f2875c068a", "permission": 0 },
    { "address": "0xe8570478ea019edf1deaf114f9545282075bcdeb", "permission": 0 },
    { "address": "0x04cb2f244c974e8607ce25c80860234add63fcc3", "permission": 1 },
    { "address": "0xdf4271fc55e4eca22831543370b2ffda3a0672fe", "permission": 0 },
    { "address": "0xdeb29b6cd55de7c17d1644db71b693f091481bfc", "permission": 0 },
    { "address": "0x770d5125d8eb0fb9851585d55845b782e6769038", "permission": 1 },
    { "address": "0x2d84b2c1512c45f10cc147978deaba04137bae6b", "permission": 1 },
    { "address": "0x1bb6893e787d02ecc4270d87005f65f3a6390820", "permission": 0 },
    { "address": "0xeb4711fa1c9faa6adee37566965fc8f239b0f00c", "permission": 1 }
])
```


```{js}
merk.utils.reduceMerkleRoot(leaves)
```