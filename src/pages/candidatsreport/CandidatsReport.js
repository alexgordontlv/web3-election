import React, { useState, useEffect } from 'react';
import { useGetContract } from '../../context/contract.context';
import Spinner from '../../components/spinner/Spinner';
import { useWeb3React } from '@web3-react/core';
import Example from '../../components/piechart/PieChart';
const CandidateReport = () => {
	const { account, library } = useWeb3React();

	const [loading, setLoading] = useState(false);
	const [candidates, setCandidates] = useState([]);

	const contract = useGetContract();
	const getVoters = async () => {
		try {
			setLoading(true);
			const isDeployed = await contract.deployed();
			console.log('TISDEPLUED:', isDeployed);

			if (isDeployed) {
				let tempCandidats = [];
				let tempCandidatsValues = [];
				const candedatesCount = await contract.candidateCount();

				for (let index = 0; index < candedatesCount; index++) {
					const candidate = await contract.getCandidateByCount(index);
					tempCandidats.push({ ...candidate, name: candidate.firstName + ' ' + candidate.lastName, value: candidate.voteCount.toNumber() + 5 });
				}
				setCandidates(tempCandidats);
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
		<div className='flex flex-wrap  justify-center mt-10'>
			<div className='-my-2 overflow-x-auto max-w-screen-lg'>
				<div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
					<div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										First Name
									</th>
									<th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Last Name
									</th>
									<th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										PoliticalView
									</th>
									<th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										VoteCount
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{candidates.length > 0 &&
									candidates.map((candidat, idx) => (
										<tr key={idx}>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>{candidat.firstName}</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>{candidat.lastName}</div>
											</td>

											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>{candidat.politicalView}</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>{candidat.value}</div>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div className='min-w-full  flex justify-center'>
				<Example candidates={candidates} />
			</div>
		</div>
	);
};

export default CandidateReport;
