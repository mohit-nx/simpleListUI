import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom'
import AuthContext from '../context/AuthContext';

export default ({ component: Component, ...rest }) => {

	const { isAuthenticated } = useContext(AuthContext);
	console.log("isAuthenticated:::::::::::privated", isAuthenticated)

	return (
		<Route {...rest} render={props => (
			isAuthenticated ?
				<Component {...props} />
				: <Redirect to="/login" />
		)} />
	)



}