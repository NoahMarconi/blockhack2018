import cmd from 'node-cmd';

export default function(path) {
    console.log('\n    Saving ' + path + ' to IPFS');
    cmd.get('ipfs add ' + path, function(err, data, stderr) { console.log(data) }); 
}