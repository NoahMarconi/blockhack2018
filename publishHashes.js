const MPArtifact = artifacts.require("./MerklePermission.sol")

let instance;

module.exports = async function(callback) {
    instance = await MPArtifact.deployed();
    await instance.setHashes(process.argv[4], process.argv[5]);
    const rootHash = await instance.rootHash();
    const ipfsHash = await instance.ipfsHash();
    console.log('rootHash set to: ' + rootHash);
    console.log('ipfsHash set to: ' + ipfsHash);
}