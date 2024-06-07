const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/accounts/create";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const createAccount = async (account) => {

	let data = JSON.stringify(account);

	//Example account
	// 	{
	// 		"ownerId": 21995, // owner id (required). Often mapped from Salesforce or other CRM
	// 		"name": "Company Name",
	// 		"domain": "www.domain.com",
	// 		"customProperties": [
	// 				{
	// 						"label": "My Number", // human readable label of property
	// 						"name": "my_number", // name of property
	// 						"value": 1, // custom property value
	// 						"type": "NUMBER" // type of custom property
	// 				}
	// 		],
	// 		"targeted": true
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
	createAccount,
};