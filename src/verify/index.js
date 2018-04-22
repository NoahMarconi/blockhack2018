import cmd from 'node-cmd';

export default function(index, address, permission, proof) {
    console.log('\n    Verifying permission == ' + permission);
    console.log('    For address: ' + address);
    cmd.get(
        'truffle exec verifyProof.js ' + index + ' ' + address + ' ' + permission + ' ' + JSON.stringify(proof),
        function(err, data, stderr) { console.log(data) }
    );
}