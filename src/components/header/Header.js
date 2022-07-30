import { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Link, useHistory } from 'react-router-dom';
import { useUserContext } from '../../context/user.context';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useContractContext, useGetContract } from '../../context/contract.context';
import Elections from '../../contracts/Elections.json';
import { Contract } from '@ethersproject/contracts';

const navigation = [
	{ name: 'Voters', href: '/voters', current: false },
	{ name: 'Candidates', href: '/candidates', current: false },
	{ name: 'Elections', href: '/elections', current: false },
	{ name: 'Register Candidate', href: '/register-cantidate', current: false },
	{ name: 'Register Voter', href: '/register-voter', current: false },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

export default function Header() {
	const { active, account, activate, chainId, library, deactivate } = useWeb3React();
	console.log('NETWORK:', chainId);
	const history = useHistory();
	const contractContext = useContractContext();

	const [location, setLocation] = useState('');
	const [vtnBalance, setVtnBalance] = useState(null);
	const {
		state: { currentUser, isAdmin },
		setCurrentUser,
	} = useUserContext();
	let filteredNavigation = navigation.filter((nav) => {
		if (nav.name !== 'Register Voter' && nav.name !== 'Register Candidate') return nav;
	});
	console.log(isAdmin, currentUser);
	useEffect(() => {
		history.listen((location) => {
			setLocation(location.pathname);
		});
	}, [history]);

	useEffect(async () => {
		if (account) {
			setCurrentUser({ currentUser: account, isAdmin: account === '0x35197E0Dcb276f0AC5A2146F0718AF8671eDE9Ef' ? true : false });
			const signer = await library.getSigner(account);
			const ballotContract = new Contract('0xC9Af7914B9aA0928a18283397f1Fa77342750158', Elections.abi, signer);
			contractContext.setContract(ballotContract);
			const result2 = await ballotContract.getBalanceOf(account);
			console.log('BALANMCE', result2.toNumber());
			setVtnBalance(result2.toNumber());
			//			localStorage.setItem('currentUser', JSON.stringify(account));
		} else {
			setCurrentUser(null);
			setVtnBalance(null);
		}
	}, [account]);

	const handleLogOut = () => {
		setCurrentUser(null);
		deactivate();
		history.push('/');
	};

	const handleConnect = async () => {
		activate(new InjectedConnector({}));
	};

	return (
		<Disclosure as='nav' className=''>
			{({ open }) => (
				<>
					<div className=' max-w-5xl mx-auto  '>
						<div className='relative flex items-center justify-between h-16 w-full'>
							<div className='absolute inset-y-0 left-0 flex items-center sm:hidden ml-2'>
								{/* Mobile menu button*/}
								<Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md bg-black text-white hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset'>
									<span className='sr-only'>Open main menu</span>
									{open ? <XIcon className='block h-6 w-6' aria-hidden='true' /> : <MenuIcon className='block h-6 w-6' aria-hidden='true' />}
								</Disclosure.Button>
							</div>

							<div className='flex-1 flex items-center justify-center md:justify-between sm:items-stretch '>
								<Link to='/'>
									<div className='flex items-center justify-start mr-10 md:mr-0'>
										<p className='text-xl font-light sm:text-2xl'>{vtnBalance && 'Current VTN Balance: ' + vtnBalance}</p>
									</div>
								</Link>
								<div className='hidden sm:block sm:ml-6 items-center justify-center'>
									<div className='flex space-x-4'>
										{filteredNavigation.map((item) => (
											<Link to={item.href} key={item.name} className={classNames(item.href === location ? 'bg-black text-white' : 'text-black hover:underline ', 'px-3 py-2 rounded-md text-sm font-normal ')} aria-current={item.href === location ? 'page' : undefined}>
												{item.name}
											</Link>
										))}
									</div>
								</div>

								<div className=' absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
									{/* Profile dropdown */}
									{currentUser ? (
										<Menu as='div' className='ml-3 relative'>
											{({ open }) => (
												<>
													<div>
														<Menu.Button className='bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'>
															<span className='sr-only'>Open user menu</span>
															<img className='h-10 w-10 rounded-full' src='https://i.imgur.com/8Km9tLL.jpg' alt='' />
														</Menu.Button>
													</div>
													<Transition show={open} as={Fragment} enter='transition ease-out duration-100' enterFrom='transform opacity-0 scale-95' enterTo='transform opacity-100 scale-100' leave='transition ease-in duration-75' leaveFrom='transform opacity-100 scale-100' leaveTo='transform opacity-0 scale-95'>
														<Menu.Items static className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
															<Menu.Item>
																{({ active }) => (
																	<Link to='/' onClick={handleLogOut} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
																		<div>
																			{' '}
																			{account && account.substr(0, 8)}...{account && account.substr(-8, 8)}
																		</div>
																	</Link>
																)}
															</Menu.Item>
															{isAdmin ? (
																<>
																	<Menu.Item>
																		{({ active }) => (
																			<Link to='/date-picker' className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
																				<div> Set Elections Date</div>
																			</Link>
																		)}
																	</Menu.Item>
																	<Menu.Item>
																		{({ active }) => (
																			<Link to='/register-cantidate' className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
																				<div> Register Candidate</div>
																			</Link>
																		)}
																	</Menu.Item>
																	<Menu.Item>
																		{({ active }) => (
																			<Link to='/register-voter' className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
																				<div> Register Voter</div>
																			</Link>
																		)}
																	</Menu.Item>
																</>
															) : (
																<div></div>
															)}

															<Menu.Item>
																{({ active }) => (
																	<Link to='/' onClick={handleLogOut} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
																		Sign out
																	</Link>
																)}
															</Menu.Item>
														</Menu.Items>
													</Transition>
												</>
											)}
										</Menu>
									) : (
										<div className='flex justify-end items-center'>
											<button onClick={handleConnect} type='submit' className={` bg-black text-white px-1 py-2 sm:px-3 sm:py-3 rounded w-full  hover:bg-gray-800 focus:outline-none`}>
												Connect
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					<Disclosure.Panel className='sm:hidden'>
						<div className='px-2 pt-2 pb-3 space-y-1'>
							{filteredNavigation.map((item) => (
								<Link to={item.href} key={item.name} className={classNames(item.current ? 'bg-gray-900 text-white underline' : 'text-black hover:underline', 'block px-3 py-2 rounded-md text-base font-medium')} aria-current={item.current ? 'page' : undefined}>
									{item.name}
								</Link>
							))}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
