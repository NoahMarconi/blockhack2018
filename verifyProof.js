const MPArtifact = artifacts.require("./MerklePermission.sol")

const indexIdx = process.argv.length - 4;
const addressIdx = process.argv.length - 3;
const permissionIdx = process.argv.length - 2;
const proofIdx = process.argv.length - 1;

let instance;

module.exports = async function(callback) {
    instance = await MPArtifact.deployed();
    const index = parseInt(process.argv[indexIdx]);
    const address = process.argv[addressIdx];
    const permission = parseInt(process.argv[permissionIdx]);
    const proof = JSON.parse(process.argv[proofIdx]);

    console.log('    Index: ' + index);
    console.log('    Address: ' + address);
    console.log('    Permission: ' + permission);
    console.log('    Proof: ' + proof);

    const res = await instance.isAdmin(index, address, permission, proof);
    console.log('    Is admin: ' + res);
}