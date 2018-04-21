#!/usr/bin/env node

const program = require('commander');
const merkleTools = require('../index.js');
const pkg = require('./../package.json');

program
	.version('merkle-tools ' + pkg.version);

program
    .command('save <file>')
    .description('Save to IPFS')
    .action(function(file, opts) {
        merkleTools.save(file);
    });

program
    .command('merkle-root <file>')
    .description('Get Merkle Root')
    .action(function(file, opts) {
        merkleTools.merkleRoot(file);
    });
    
program
    .command('merkle-proof <file> <index>')
    .description('Get merkle proof for index')
    .action(function(file, index, opts) {
        merkleTools.merkleProof(index, file);
    })

    // .command('publish <ipfs-hash> <merkle-root>', 'Publish IPFS hash and Merkle Root')
    
    



program.parse(process.argv);

if (program.args.length === 0) program.help();