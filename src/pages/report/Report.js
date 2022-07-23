import React, { useState } from 'react';
import { useGetCurrentUser } from '../../context/user.context';
import Spinner from '../../components/spinner/Spinner';

const Report = () => {
	//const [isLoading, setIsLoading] = useState(false);
	const currentUser = useGetCurrentUser();

	//if (isLoading) return <Spinner />;
	return <div className='flex justify-center mt-10'>REPORT {currentUser}</div>;
};

export default Report;
