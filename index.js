'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var cmd = _interopDefault(require('node-cmd'));
require('babel-polyfill');

function save (path) {
    console.log('Saving ' + path + ' to IPFS');
    cmd.get('ipfs add ' + path, function (err, data, stderr) {
        console.log(data);
    });
}

var ethers = require('ethers');

/*=============================================

from Merkle Aidrop Repo:

    reduceMerkleParents
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

function merkleRoot (ipfsHash) {
    console.log('\n    Getting ' + ipfsHash + ' from IPFS \n');
    cmd.get('ipfs cat ' + ipfsHash, function (err, data, stderr) {
        console.log('    Computed Merkle Root: \n    ' + reduceMerkleRoot(hash(JSON.parse(data))));
    });
}

var index = {
    save: save,
    merkleRoot: merkleRoot
};

module.exports = index;
