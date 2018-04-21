const MerklePermission = artifacts.require("./MerklePermission.sol");

module.exports = async function(deployer) {
  await deployer.deploy(MerklePermission);
};