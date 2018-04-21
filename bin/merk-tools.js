#!/usr/bin/env node

const program = require('commander');

  
program
    .command('save <file>', 'Save to IPFS')
    .command('merkle-root <file>', 'Get Merkle Root')
    .command('publish <ipfs-hash> <mrkle-root>', 'Publish IPFS hash and Merkle Root')
    .command('proof <index>', 'Get merkle proof for index')
    .action(function(cmd, opts){
        switch (cmd) {
            case 'save': 
                save(opts);
            
            case 'merkle-root':
                merkleRoot(opts);

            case 'publish':
                publish(opts);
            
            case proof:
                proof(opts);
            
            default:
                program.outputHelp();
        }
    });


program.parse(process.argv);