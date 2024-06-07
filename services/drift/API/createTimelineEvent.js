const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/contacts/timeline";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const createTimelineEvent = async (event) => {

	let data = JSON.stringify(event);

	//Example event
	// {
	// 	"contactId": 12321321321,
	// 	"createdAt": 178956655,
	// 	"externalId": '2s1sa2df1s2d1s21f2s1f2333',
	// 	"event": 'Event title'
	// }

	return axios
		.post(baseUrl, data, {
			headers
		})
		.then((res) => {
			return res.data.data;
		})
		.catch((err) => {
			console.log(err.message);
			return err
		});

};

module.exports = {
	createTimelineEvent,
};