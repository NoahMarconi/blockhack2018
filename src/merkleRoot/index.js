import cmd from 'node-cmd';
import utils from '../utils/index';

export default function(ipfsHash) {
    console.log('\n    Getting ' + ipfsHash + ' from IPFS \n');
    
    cmd.get('ipfs cat ' + ipfsHash, function(err, data, stderr) {
        console.log(
            '    Computed Merkle Root: \n    ' +
            utils.reduceMerkleRoot(utils.hash(JSON.parse(data)))
        );
    });
}