const MPArtifact = artifacts.require("./MerklePermission.sol")

const rootIdx = process.argv.length - 2;
const ipfsIdx = process.argv.length - 1;

let instance;

module.exports = async function(callback) {
    instance = await MPArtifact.deployed();
    await instance.setHashes(process.argv[rootIdx], process.argv[ipfsIdx]);
    const rootHash = await instance.rootHash();
    const ipfsHash = await instance.ipfsHash();
    console.log('rootHash set to: ' + rootHash);
    console.log('ipfsHash set to: ' + ipfsHash);
}