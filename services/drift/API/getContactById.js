const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/contacts/";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const getContactById = async (contactId) => {

	return axios
		.get(baseUrl + contactId, {
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
	getContactById,
};
