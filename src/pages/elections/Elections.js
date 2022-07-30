import React, { useState, useEffect } from 'react';
import { useGetContract } from '../../context/contract.context';
import { useGetCurrentUser } from '../../context/user.context';

import Spinner from '../../components/spinner/Spinner';

const Elections = () => {
	const [loading, setLoading] = useState(null);
	const [canVote, setCanVote] = useState(false);
	const [votingStartTime, setVotingStartTime] = useState(false);
	const [votingEndTime, setVotingEndime] = useState(false);
	const [allVotersVoted, setAllVotersVoted] = useState(false);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [candidates, setCandidates] = useState([]);
	const [winner, setWinner] = useState(null);

	const currentUser = useGetCurrentUser();

	const contract = useGetContract();

	const getCandidates = async () => {
		try {
			setLoading(true);
			const isDeployed = await contract.deployed();
			if (isDeployed) {
				let tempCandidats = [];
				const candedatesCount = await contract.candidateCount();
				const totalSupply = await contract.getVoters();

				const haveEveryOneVoted = (await contract.getIsAllVotersCounted()) && totalSupply.toNumber() > 0;

				setAllVotersVoted(haveEveryOneVoted);
				let mostVotes = 0;
				let winnerCandidate = null;
				for (let index = 0; index < candedatesCount; index++) {
					const candidate = await contract.getCandidateByCount(index);
					console.log(candidate.voteCount.toNumber());
					if (candidate.voteCount.toNumber() > mostVotes) {
						mostVotes = candidate.voteCount.toNumber();
						winnerCandidate = candidate;
					}
					tempCandidats.push(candidate);
				}
				console.log('WINNER', winnerCandidate);
				setWinner(winnerCandidate);
				setCandidates(tempCandidats);
			}
			const voterResult = await contract.getVoterStructByAddress(currentUser);
			if (voterResult && voterResult.exists && !voterResult.voted) {
				setCanVote(true);
			}
		} catch (error) {
			console.error('ERROR', error);
		}
		setLoading(false);
	};

	const getVotingTime = async () => {
		try {
			const result = await contract.getVotingDate();
			const startTime = new Date(result.startDateTicks.toNumber());
			const endTime = new Date(result.endDateTicks.toNumber());
			setVotingStartTime(startTime);
			setVotingEndime(endTime);
			setCurrentDate(new Date());
		} catch (error) {
			console.error('ERROR', error);
		}
	};

	const handleVote = async (candidateId) => {
		setLoading(true);
		try {
			const votingResult = await contract.voteNow(parseInt(candidateId), parseInt(currentDate.getTime()));
			console.log(votingResult);
			setCanVote(false);
		} catch (error) {
			console.log('ERROR', error);
		}
		setLoading(false);
	};

	useEffect(async () => {
		await getVotingTime();
		await getCandidates();
	}, []);

	if (loading) return <Spinner />;
	if (votingStartTime && currentDate < votingStartTime)
		return (
			<div className='flex  text-center  justify-center'>
				<div className='text-2xl'>The voting time is not now, we will start at: {votingStartTime.toString()}</div>
			</div>
		);
	if (votingEndTime && (currentDate > votingEndTime || allVotersVoted))
		return (
			<div className='flex  text-center  justify-center  flex-wrap '>
				{currentDate > votingEndTime && <div className='text-2xl'>The voting ended at: {votingEndTime.toString()}</div>}

				<div className='text-2xl'>WINNER: {winner && winner.firstName + ' ' + winner.lastName}</div>
			</div>
		);
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
										Vote
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{candidates.length > 0 &&
									candidates.map((candidate, idx) => (
										<tr key={idx}>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>{candidate.firstName}</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>{candidate.lastName}</div>
											</td>

											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>{candidate.politicalView}</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{canVote && (
													<button onClick={(e) => handleVote(candidate.candidateCount.toNumber())} className={` bg-black text-white px-3 py-2 rounded w-full mt-4 hover:bg-gray-800`}>
														{loading ? <p className='animate-pulse'>Please wait... </p> : 'Vote'}
													</button>
												)}
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

export default Elections;
