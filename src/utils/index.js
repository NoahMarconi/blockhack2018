import ethers from 'ethers';

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
        var right = leaves[i+1];

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
        
        if ((path % 2) == 1) {
            proof.push(leaves[path - 1])
        } else {
            proof.push(leaves[path + 1])
        }

        // Reduce the merkle tree one level
        leaves = reduceMerkleParents(leaves);

        // Move up
        path = parseInt(path / 2);
    }

    return proof;
}

function hash(arr) {

    const zeros32 = '0000000000000000000000000000000000000000000000000000000000000000';
    
    function _hash(_index, _address, _permission) {

        const address = _address.substring(2);

        let index = zeros32 + (_index).toString(16);
        index = index.substring(index.length - 64);
        
        let permission = zeros32 + (_permission).toString(16);
        permission = permission.substring(permission.length - 64);

        return ethers.utils.keccak256('0x' + index + address + permission)
    }

    return arr.map(function(leaf, i) {
        return _hash(i, leaf.address, leaf.permission);
    });
}

/**
 * 
 * @param {Number} index - Index of value in leaf array.
 * @param {String} leafHash - Hashed leaf node.
 * @param {Array} merkleProof - Merkle proof hashes.
 * @param {String} merkleRoot - Merkle root to check against.
 */
function checkMerkleProof(index, leafHash, merkleProof, merkleRoot) {
    
    var node = leafHash;
    var path = index;
    
    for (var i = 0; i < merkleProof.length; i += 1) {
        // Odd / Even check
        if ((path & 0x01) == 1) {
            node = ethers.utils.keccak256(merkleProof[i] + node.substring(2));
        } else {
            node = ethers.utils.keccak256(node + merkleProof[i].substring(2));
        }
        path = parseInt(path / 2);
    }
    
    return node === merkleRoot;
}

export default {
    reduceMerkleParents,
    reduceMerkleRoot,
    merkleProof,
    hash,
    checkMerkleProof
}