import React, { Suspense } from 'react';

import { useUserContext } from '../../context/user.context';
import { Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from '../../components/privateroute/PrivateRoute';
import Spinner from '../../components/spinner/Spinner';
import { QueryClient, QueryClientProvider } from 'react-query';

const Login = React.lazy(() => import('../login/Login'));
const MainBody = React.lazy(() => import('../mainbody/MainBody'));
const CandidatsRegister = React.lazy(() => import('../candidatsregister/CandidatsRegister'));
const VoterRegister = React.lazy(() => import('../voterregister/VoterRegister'));
const UserCard = React.lazy(() => import('../../components/usercard/UserCard'));

const VotersReport = React.lazy(() => import('../votersreport/VotersReport'));
const CandidatsReport = React.lazy(() => import('../candidatsreport/CandidatsReport'));
const DatePicker = React.lazy(() => import('../datepicker/DatePicker'));
const Elections = React.lazy(() => import('../elections/Elections'));
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
						<PrivateRoute path='/register-cantidate' component={CandidatsRegister} admin />
						<PrivateRoute path='/date-picker' component={DatePicker} admin />
						<PrivateRoute path='/register-voter' component={VoterRegister} admin />
						<PrivateRoute path='/elections' component={Elections} />
						<PrivateRoute path='/voters' component={VotersReport} />
						<PrivateRoute path='/candidates' component={CandidatsReport} />
						<PrivateRoute path='/profile' component={UserCard} />
					</QueryClientProvider>
				</Suspense>
			</Switch>
		</div>
	);
};

export default Mainpage;
