import React, { useState, useRef } from 'react';
import { useModalContext } from '../../context/modal.context';
import WrapperCard from '../../components/wrappercard/WrapperCard.js';
import { useWeb3React } from '@web3-react/core';
import { useGetContract } from '../../context/contract.context';

const candidateViews = ['Moderate', 'Conservative', 'Capitalism', 'Social Liberalism', 'Separatism', 'Fascism'];

const CandidatsRegister = () => {
	const firstNameRef = useRef(null);
	const lastNameRef = useRef(null);
	const personalIdRef = useRef(null);
	const politicalViewRef = useRef(null);

	const contract = useGetContract();

	const [loading, setLoading] = useState('');
	const { setOpenModal } = useModalContext();
	const handleSubmit = async (event) => {
		setLoading(true);
		event.preventDefault();
		console.log(personalIdRef.current.value);
		console.log(firstNameRef.current.value);
		console.log(lastNameRef.current.value);
		console.log(politicalViewRef.current.value);
		if (!firstNameRef.current.value || !lastNameRef.current.value || !personalIdRef.current.value || !politicalViewRef.current.value) {
			setOpenModal('Please fill the form currectly');
			return;
		}

		try {
			console.log(contract);
			const result = await contract.createCandidate(firstNameRef.current.value, lastNameRef.current.value, politicalViewRef.current.value);
			console.log('RESULT:', result);
		} catch (error) {
			console.log('ERROR:', error);
		}
		setLoading(false);
		firstNameRef.current.value = null;
	};

	return (
		<WrapperCard>
			<h2 className=' text-center text-3xl font-extrabold text-gray-900 mb-10'>Register Candidate</h2>
			<form className='w-full max-w-lg' onSubmit={handleSubmit}>
				<div className='flex flex-wrap -mx-3 mb-6'>
					<div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
						<label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' for='grid-first-name'>
							First Name
						</label>
						<input ref={firstNameRef} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='grid-last-name' type='text' placeholder='John' />
					</div>
					<div className='w-full md:w-1/2 px-3'>
						<label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' for='grid-last-name'>
							Last Name
						</label>
						<input ref={lastNameRef} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='grid-last-name' type='text' placeholder='Doe' />
					</div>
				</div>

				<div className='flex flex-wrap -mx-3 mb-6'>
					<div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
						<label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' for='grid-city'>
							Personal Id
						</label>
						<input ref={personalIdRef} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='grid-city' type='number' placeholder='312121313' />
					</div>
					<div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
						<label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' for='grid-state'>
							Political View
						</label>
						<div className='relative'>
							<select ref={politicalViewRef} className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='grid-state'>
								{candidateViews.map((view) => (
									<option value={view}>{view}</option>
								))}
							</select>
							<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
								<svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
									<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
								</svg>
							</div>
						</div>
					</div>
				</div>
				<button type='submit' className={` bg-black text-white px-3 py-2 rounded w-full mt-4 hover:bg-gray-800`}>
					{loading ? <p className='animate-pulse'>Please wait... </p> : 'Submit'}
				</button>
			</form>
		</WrapperCard>
	);
};

export default CandidatsRegister;
