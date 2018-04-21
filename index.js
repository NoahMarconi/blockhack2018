'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var cmd = _interopDefault(require('node-cmd'));
var ethers = _interopDefault(require('ethers'));
require('babel-polyfill');

function save (path) {
    console.log('Saving ' + path + ' to IPFS');
    cmd.get('ipfs add ' + path, function (err, data, stderr) {
        console.log(data);
    });
}

/*=============================================

from Merkle Aidrop Repo:

    reduceMerkleParents,
    merkleProof
    and reduceMerkleRoot
        
=============================================*/

/**
 * Reduce children nodes to thier merkle parent nodes. 
 * This method is side effect free and returns a new array.
 * @param {Array} leaves - Child nodes.
 * @return {Array} - Parent nodes.
 */
function reduceMerkleParents(leaves) {
    var output = [];

    for (var i = 0; i < leaves.length; i += 2) {
        var left = leaves[i];
        var right = leaves[i + 1];

        // If only left node, hash left with left.
        output.push(ethers.utils.keccak256(left + (right ? right.substring(2) : left.substring(2))));
    }

    return output;
}

/** 
 * Reduce children to Merkle root hash.
 * @param {Array} leaves - Child nodes.
 * @return {String} - Root hash. 
 */
function reduceMerkleRoot(leaves) {
    var output = leaves;

    while (output.length > 1) {
        output = reduceMerkleParents(output);
    }

    return output[0];
}

function merkleProof(index, leaves) {

    var path = index;

    var proof = [];

    while (leaves.length > 1) {

        if (path % 2 == 1) {
            proof.push(leaves[path - 1]);
        } else {
            proof.push(leaves[path + 1]);
        }

        // Reduce the merkle tree one level
        leaves = reduceMerkleParents(leaves);

        // Move up
        path = parseInt(path / 2);
    }

    return proof;
}

function hash(arr) {

    var zeros32 = '0000000000000000000000000000000000000000000000000000000000000000';

    function _hash(_index, _address, _permission) {

        var address = _address.substring(2);

        var index = zeros32 + _index.toString(16);
        index = index.substring(index.length - 64);

        var permission = zeros32 + ethers.utils.hexlify(ethers.utils.toUtf8Bytes(_permission)).substring(2);
        permission = permission.substring(permission.length - 64);

        return ethers.utils.keccak256('0x' + index + address + permission);
    }

    return arr.map(function (leaf, i) {
        return _hash(i, leaf.address, leaf.permission);
    });
}

var utils = {
    reduceMerkleParents: reduceMerkleParents,
    reduceMerkleRoot: reduceMerkleRoot,
    merkleProof: merkleProof,
    hash: hash
};

function merkleRoot (ipfsHash) {
    console.log('\n    Getting ' + ipfsHash + ' from IPFS \n');
    cmd.get('ipfs cat ' + ipfsHash, function (err, data, stderr) {
        console.log('    Computed Merkle Root: \n    ' + utils.reduceMerkleRoot(utils.hash(JSON.parse(data))));
    });
}

function merkleProof$1 (index, ipfsHash) {
    console.log('\n    Getting ' + ipfsHash + ' from IPFS \n');
    cmd.get('ipfs cat ' + ipfsHash, function (err, data, stderr) {
        console.log('    Computed Merkle Proof: \n    ' + utils.merkleProof(parseInt(index), utils.hash(JSON.parse(data))));
    });
}

function publish (rootHash, ipfsHash) {
    console.log('Publishing Merkle Root' + rootHash);
    console.log('Publishing IPFS Hash' + ipfsHash);
    cmd.get('truffle exec publishHashes.js ' + rootHash + ' ' + ipfsHash, function (err, data, stderr) {
        console.log(data);
    });
}

var index = {
    save: save,
    merkleRoot: merkleRoot,
    merkleProof: merkleProof$1,
    publish: publish
};

module.exports = index;
