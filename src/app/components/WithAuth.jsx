import React from 'react';

import request from '../lib/request';
import AuthContext from '../context/AuthContext';

export default class WithAuth extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isAuthenticated: null,
			token: null,
			user: null,
		}
	}

	async componentDidMount() {
		const token = localStorage.getItem('token');
		if (token) {
			request('get', '/user/verify', {}, { authorization: token })
				.then(userDetails => {
					console.log("dadadadadad", userDetails)
						if (userDetails.data) {
							this.setState({ token, isAuthenticated: true, user: userDetails.data.user });
						}
				})
				.catch(err => {
					console.log("dadadadadad", err)

					this.setState({ isAuthenticated: false });
				});

		} else {
			this.setState({ isAuthenticated: false });
		}
	}

	login = async (payload) => {
		try {
			const response = await request('post', '/user/login', payload);
			console.log("response", response);
			if (response.data && response.data.token) {
				this.setState({ isAuthenticated: true, token: response.data.token, user: { email: payload.email } }, 
					() => localStorage.setItem('token', response.data.token))
			}
			// return response;
		} catch (err){
			console.log("err", JSON.stringify(err));
			throw { message: "Email/Password did not match" }
		}
		
	} 

	logout = () => {
		this.setState({ isAuthenticated: false, token: null, user: null }, () => localStorage.removeItem('token'));
	}

	render() {
		const { children } = this.props;
		const { isAuthenticated, token, user } = this.state;
		if (isAuthenticated === null) {
			return (<></>);
		}

		return (
			<AuthContext.Provider value={{ token, user, isAuthenticated, login: this.login, logout: this.logout }} >
				{children}
			</AuthContext.Provider>
		)
	}

}