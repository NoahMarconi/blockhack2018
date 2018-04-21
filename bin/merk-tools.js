#!/usr/bin/env node

const program = require('commander');
const merkleTools = require('..');
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
    
    // .command('publish <ipfs-hash> <mrkle-root>', 'Publish IPFS hash and Merkle Root')
    // .command('proof <index>', 'Get merkle proof for index')



program.parse(process.argv);

if (program.args.length === 0) program.help();