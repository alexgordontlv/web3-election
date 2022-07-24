import React, { useState, useEffect } from 'react';
import { useGetCurrentUser } from '../../context/user.context';
import moment from 'moment';
import Spinner from '../../components/spinner/Spinner';
import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import Voters from '../../contracts/Voters.json';

const Report = () => {
	const { account, library } = useWeb3React();

	const [loading, setLoading] = useState(false);
	const [voters, setVoters] = useState([]);

	const currentUser = useGetCurrentUser();
	console.log('USER ID', currentUser._id);

	const getVoters = async () => {
		try {
			setLoading(true);
			const signer = await library.getSigner(account);

			const daiContract = new Contract('0x5DBf4A823bd1A995b30Be90b90Cbb84fdcB54beb', Voters.abi, signer);
			const isDeployed = await daiContract.deployed();
			if (isDeployed) {
				let tempVoters = [];
				let totalSupply = await daiContract.totalSupply();
				for (let index = 0; index < totalSupply; index++) {
					const voter = await daiContract.ownerOf(index);
					tempVoters.push(voter);
				}
				setVoters(tempVoters);
			}
		} catch (error) {
			console.log('ERROR', error);
		}
		setLoading(false);
	};

	useEffect(() => {
		getVoters();
	}, []);
	console.log(voters);
	if (loading) return <Spinner />;
	return (
		<div className='flex justify-center mt-10'>
			<div className='-my-2 overflow-x-auto max-w-screen-lg'>
				<div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
					<div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Voter Address
									</th>
									<th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Has Voted
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{voters.length > 0 &&
									voters.map((voter, idx) => (
										<tr key={idx}>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>{voter}</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>FALSE</div>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Report;
