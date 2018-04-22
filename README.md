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

Smart Contract development on the public blockchain is unlike other paradigms. Storage is not cheap by any stretch of the imagination should be used a infrequently as possible.

Data intensive use cases, such as suply chain management or even access management for a large organization are non starters due to storage costs. 

## Solution

We build off of Richard Moores [Merkle AirDrops](https://blog.ricmoo.com/merkle-air-drops-e6406945584d) and introduce to novel additions:

  1. Pair with IPFS storage for data persistance;
  2. Demonstrate a new use case.

The specific use case we demonstrate is updating permissions, access control, for any number of parties, without publishing thier addresses to the public chain. Should permissions change, a single root hash is published to the smart contract along with the ipfs hash of the latest dataset.

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

In our demonstration, 1 is and admin and 0 is a view only access. However, any range of permission schemes can be supported.

### Raw Data to IPFS

The `save` command saves the raw data to IPFS.

In the project directory run `node bin/merk-tools.js save ./testData.json` and the IPFS hash is logged to the console:

```
Noahs-MacBook-Air:blockhack2018 noahmarconi$ node bin/merk-tools.js save ./testData.json
Saving ./testData.json to IPFS
added QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG testData.json
```

### IPFS Data to Merkle Root

The `merkle-root` command computes the merkel root hash from the dataset stored on IPFS.

In the project directory run `node bin/merk-tools.js merkle-root QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG` ensuring the hash is the one returned when you ran the `save` command.

```
Noahs-MacBook-Air:blockhack2018 noahmarconi$ node bin/merk-tools.js merkle-root QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG

    Getting QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG from IPFS

    Computed Merkle Root:
    0xa2da7aca0ce86e4ed4902fb2f0b97d18f1a39e96457601406e8ffd6beffccd29
```

### Publish to Smart Contract

The `publish` command persists the merkle root hash and the IPFS hash to the relevant smart contract.

```
Noahs-MacBook-Air:blockhack2018 noahmarconi$ node bin/merk-tools.js publish 0xa2da7aca0ce86e4ed4902fb2f0b97d18f1a39e96457601406e8ffd6beffccd29 QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG
Publishing Merkle Root0xa2da7aca0ce86e4ed4902fb2f0b97d18f1a39e96457601406e8ffd6beffccd29
Publishing IPFS HashQmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG
Using network 'development'.

rootHash set to: 0xa2da7aca0ce86e4ed4902fb2f0b97d18f1a39e96457601406e8ffd6beffccd29
ipfsHash set to: QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG
```
The `set to:` confirmations that are logged read from the chain confirming that the hashes have been correctly set.

### Get Merkle Proof

The `merkle-proof` command computes the merkle proof from a particular address. As there can be multiple permissions per address, an index is required as input instead of the address.

```
Noahs-MacBook-Air:blockhack2018 noahmarconi$ node bin/merk-tools.js merkle-proof QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG 5

    Getting QmUbr6QEAgSxraQEm1YutLGGNKU5sceLjL1SSxDJbMhdnG from IPFS

    Computed Merkle Proof:
    0xe3f9d19da85727b4b6d34bf596ae0e65b5c0e48ddfc75d384d3903e7dd9bc241,0x9b32e97554c36e9632ae438783236dfabe5ff34ca911ade46e9e4368b1b11866,0xaabfd2d196411c67659bcdf7fa66d38d8ff675ce05006a23c90a54216426bd4a,0xfdfc4af370dfa446bff2972dbbdf127b822179c8a7fa61260ef0ae18b8a7dc5f
```



