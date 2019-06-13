import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

import WithAuth from './components/WithAuth';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './scenes/Dashboard';
import Login from './scenes/Login';
import SnackBar from './components/Snackbar'

export default (props) => (
	<WithAuth>
		<SnackBar>
			<Switch>
				<PublicRoute
					exact
					path="/login"
					component={Login}
				/>
				<PrivateRoute
					exact
					path="/dashboard"
					component={Dashboard}
				/>
				<Redirect to="/dashboard" />
			</Switch>
		</SnackBar>
	</WithAuth>
)