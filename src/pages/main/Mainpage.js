import React, { Suspense } from 'react';

import { useUserContext } from '../../context/user.context';
import { Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from '../../components/privateroute/PrivateRoute';
import Spinner from '../../components/spinner/Spinner';
import { QueryClient, QueryClientProvider } from 'react-query';

const Login = React.lazy(() => import('../login/Login'));
const MainBody = React.lazy(() => import('../mainbody/MainBody'));
const CandidateRegister = React.lazy(() => import('../candidateregister/CandidateRegister'));
const VoterRegister = React.lazy(() => import('../voterregister/VoterRegister'));
const UserCard = React.lazy(() => import('../../components/usercard/UserCard'));

const VotersReport = React.lazy(() => import('../report/VotersReport'));
const queryClient = new QueryClient();

const Mainpage = () => {
	const {
		state: { currentUser },
	} = useUserContext();
	return (
		<div className='main'>
			<Switch>
				<Suspense fallback={<Spinner />}>
					<QueryClientProvider client={queryClient}>
						<Route exact path='/' component={MainBody} />
						<Route path='/login' render={(props) => (!currentUser ? <Login /> : <Redirect to='/' />)} />
						<PrivateRoute path='/register-cantidate' component={CandidateRegister} admin />
						<PrivateRoute path='/register-voter' component={VoterRegister} admin />
						<Route path='/report' component={VotersReport} />
						<PrivateRoute path='/profile' component={UserCard} />
					</QueryClientProvider>
				</Suspense>
			</Switch>
		</div>
	);
};

export default Mainpage;
