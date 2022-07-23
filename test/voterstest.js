const Voters = artifacts.require('Voters');

contract('Voters', (accounts) => {
	let contract;
	before(async () => {
		contract = await Voters.deployed();
	});
	it('Get Deployed', async () => {
		assert.notEqual(contract, '');
	});

	it('Get minted', async () => {
		const result = await contract.mint('0xfd67128dB1FEcf8d78bfE727B1b76004F4295e67');
		let voter = await contract.voters(0);
		assert.equal(voter, '0xfd67128dB1FEcf8d78bfE727B1b76004F4295e67');
	});
});
