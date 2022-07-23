import React, { useState, useRef, useEffect } from 'react';
import axios from '../../utilities/axios/axios';
import { useModalContext } from '../../context/modal.context';
import WrapperCard from '../../components/wrappercard/WrapperCard.js';
import { useWeb3React } from '@web3-react/core';
import { formatEther } from '@ethersproject/units';
import { Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const daiAbi = [
	// Some details about the token
	'function name() view returns (string)',
	'function symbol() view returns (string)',

	// Get the account balance
	'function balanceOf(address) view returns (uint)',

	// Send some of your tokens to someone else
	'function transfer(address to, uint amount)',

	// An event triggered whenever anyone transfers to someone else
	'event Transfer(address indexed from, address indexed to, uint amount)',
];

function useBalance() {
	const { account, library } = useWeb3React();
	const [balance, setBalance] = useState();

	useEffect(() => {
		if (account) {
			library.getBalance(account).then((val) => setBalance(val));
		}
	}, [account, library]);

	return balance ? `${formatEther(balance)} ETH` : null;
}
const VoterRegister = () => {
	const voterAddressRef = useRef(null);

	const [loading, setLoading] = useState('');
	const { setOpenModal } = useModalContext();
	const { account, library } = useWeb3React();
	const balance = useBalance();

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!voterAddressRef.current.value) {
			setOpenModal('Please fill the form currectly');
			return;
		}
		setLoading(true);
		try {
			const message = `Logging in at ${new Date().toISOString()}`;
			const signer = await library.getSigner(account);
			const daiContract = new Contract('dai.tokens.ethers.eth', daiAbi, signer);

			const name = await daiContract.name();
			const symbol = await daiContract.symbol();

			console.log(name);
			console.log(symbol);
			// const signature = await library
			// 	.getSigner(account)
			// 	.signMessage(message)
			// 	.catch((error) => console.error(error));
			//console.log({ message, account, signature });
		} catch (error) {
			console.log('ERROR:', error);
		}
	};

	return (
		<WrapperCard>
			<h2 className=' text-center text-3xl font-extrabold text-gray-900 mb-10'>Register Voter</h2>
			<form className='w-full max-w-lg' onSubmit={handleSubmit}>
				<div className='flex flex-wrap -mx-3 mb-6'>
					<div className='w-full px-3'>
						<label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' for='grid-password'>
							Wallet Address
						</label>
						<input ref={voterAddressRef} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='grid-password' type='text' />
						<p className='text-gray-600 text-xs italic'>for example: 0xb794f5ea0ba39494ce839613fffba74279579268</p>
					</div>
				</div>

				<button type='submit' className={` bg-black text-white px-3 py-2 rounded w-full mt-4 hover:bg-gray-800`}>
					{loading ? <p className='animate-pulse'>Please wait... </p> : 'Submit'}
				</button>
			</form>
		</WrapperCard>
	);
};

export default VoterRegister;
