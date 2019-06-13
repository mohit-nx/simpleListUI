import axios from 'axios';
// const host_url = "https://password-management-staging.herokuapp.com/api";
const host_url =  process.env.REACT_APP_SERVICE_URI || 'http://localhost:3000/api';

export default (method, url, data, headers = {}) => {
	const axios_request = {
		method,
		data,
		headers,
		url: `${host_url}${url}`
	}
	if (method === "get") {
		delete axios_request.data;
	}

	return axios(axios_request);
}