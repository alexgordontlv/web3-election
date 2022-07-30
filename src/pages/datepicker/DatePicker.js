import React, { useState, useRef } from 'react';
import Spinner from '../../components/spinner/Spinner';
import { useWeb3React } from '@web3-react/core';
import { useGetContract } from '../../context/contract.context';

const DatePicker = () => {
	const { account, library } = useWeb3React();

	const [loading, setLoading] = useState(false);
	const [date, setDate] = useState(new Date());
	const [hours, setHours] = useState(0);

	const contract = useGetContract();

	const setElections = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			console.log(hours);
			const startDateTicks = new Date(date).getTime();
			const endDateTicks = new Date(new Date(date).setHours(new Date(date).getHours() + parseInt(hours))).getTime();

			const result = await contract.setVotingDate(startDateTicks, endDateTicks);
		} catch (error) {
			console.log('ERROR', error);
		}
		setLoading(false);
	};

	if (loading) return <Spinner />;
	return (
		<div className='flex flex-wrap  justify-center mt-10'>
			<div className='-my-2 overflow-x-auto max-w-screen-lg'>
				<div className='relative'>
					<div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'></div>
					<label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' for='grid-city'>
						Select Election Date
					</label>
					<input onChange={(e) => setDate(e.target.value)} datepicker-title='Flowbite datepicker' type='datetime-local' className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder='Select Date' />
				</div>
				<label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' for='grid-city'>
					Select Election Duration In Hours
				</label>
				<input value={hours} onChange={(e) => setHours(e.target.value)} datepicker-title='Flowbite datepicker' type='number' className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder='Select Hours Duration' />
				<button onClick={setElections} className={` bg-black text-white px-3 py-2 rounded w-full mt-4 hover:bg-gray-800`}>
					{loading ? <p className='animate-pulse'>Please wait... </p> : 'Submit'}
				</button>
			</div>
		</div>
	);
};

export default DatePicker;
