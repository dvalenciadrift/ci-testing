const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/contacts?email=";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const getContactsByEmail = async (email, limit = '') => {

	return axios
		.get(baseUrl + email + "&limit=" + limit, {
			headers,
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.log(err.message);
			return err
		});
};

module.exports = {
	getContactsByEmail,
};