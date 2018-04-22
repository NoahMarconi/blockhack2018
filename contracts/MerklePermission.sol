pragma solidity ^0.4.19;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';


contract MerklePermission is Ownable {
  
    /*----------  Global Variables  ----------*/

    bytes32 public rootHash;
    // todo bytes not string
    string public ipfsHash;

    modifier onlyAdmin(uint256 index, uint256 permission, bytes32[] proof) {
        require(isAdmin(index, msg.sender, permission, proof));
        _;
    }

    function isAdmin(uint256 index, address checkAddress, uint256 permission, bytes32[] proof)
        public
        view
        returns(bool)
    {
        // Admin is 1;
        require(permission == 1);

        // Compute the merkle root
        bytes32 node = keccak256(index, checkAddress, permission);
        uint256 path = index;
        for (uint16 i = 0; i < proof.length; i++) {
            if ((path & 0x01) == 1) {
                node = keccak256(proof[i], node);
            } else {
                node = keccak256(node, proof[i]);
            }
            path /= 2;
        }

        // Check the merkle proof
        return node == rootHash;
    }

    function setHashes(bytes32 _rootHash, string _ipfsHash)
        public
        onlyOwner
    {
        rootHash = _rootHash;
        ipfsHash = _ipfsHash;
    }

}
