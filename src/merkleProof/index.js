import cmd from 'node-cmd';
import utils from '../utils/index';


export default function(index, ipfsHash) {
    console.log('\n    Getting ' + ipfsHash + ' from IPFS \n');
    cmd.get('ipfs cat ' + ipfsHash, function(err, data, stderr) {
        console.log(
            '    Computed Merkle Proof: \n    ' +
            utils.merkleProof(parseInt(index), utils.hash(JSON.parse(data)))
        );
    });
}