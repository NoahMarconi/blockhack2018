import cmd from 'node-cmd';

export default function(rootHash, ipfsHash) {
    console.log('\n    Publishing Merkle Root: ' + rootHash);
    console.log('    Publishing IPFS Hash: ' + ipfsHash);
    cmd.get(
        'truffle exec publishHashes.js ' + rootHash + ' ' + ipfsHash,
        function(err, data, stderr) { console.log(data) }
    );
}