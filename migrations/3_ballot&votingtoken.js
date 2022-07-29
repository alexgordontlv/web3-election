const votingToken = artifacts.require('votingToken');
const Elections = artifacts.require('Elections');

module.exports = function (deployer) {
	deployer.deploy(votingToken);
	deployer.deploy(Elections);
};
