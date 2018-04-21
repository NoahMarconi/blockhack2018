const MPArtifact = artifacts.require('MerklePermission');

contract('Merkle Permission Tests', ([owner, admin, viewer]) => {
    
    
    describe('setHashes()', async () => {
        
        let instance;
        
        before(async () => {
            instance = await MPArtifact.new({ from: owner });
            
        });

        it('sets both hashes', async function () {
            instance.setHashes(
                '0xb252312038c6779a46914c1b88acbddbb96517e0be980babd1e2869a46fb3c36',
                'QmNuwzDbrP2Nxqv5e1ptggbsiFbPoKnN13DbjEzYBbfFTU',
                { from: owner }
            );

            const rootHash = await instance.rootHash();
            const ipfsHash = await instance.ipfsHash();

            assert.equal(rootHash, '0xb252312038c6779a46914c1b88acbddbb96517e0be980babd1e2869a46fb3c36');
            assert.equal(ipfsHash, 'QmNuwzDbrP2Nxqv5e1ptggbsiFbPoKnN13DbjEzYBbfFTU');

        })
        
        
    });
});