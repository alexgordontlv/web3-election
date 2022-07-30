import React, { useState, useEffect } from 'react';
import { useGetContract } from '../../context/contract.context';
import Spinner from '../../components/spinner/Spinner';

const VotersReport = () => {
	const [loading, setLoading] = useState(false);
	const [voters, setVoters] = useState([]);
	const contract = useGetContract();
	const getVoters = async () => {
		try {
			setLoading(true);
			const isDeployed = await contract.deployed();
			console.log('TISDEPLUED:', isDeployed);

			if (isDeployed) {
				let tempVoters = [];
				let totalSupplyBallot = await contract.getVoters();

				for (let index = 0; index < totalSupplyBallot; index++) {
					const voterAddress = await contract.getOwnerOf(index);
					const voterResult = await contract.getVoterStructByAddress(voterAddress);
					tempVoters.push({ address: voterAddress, voted: voterResult.voted });
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
												<div className='text-sm text-gray-900'>{voter.address}</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>{voter.voted ? 'TRUE' : 'FALSE'}</div>
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

export default VotersReport;
