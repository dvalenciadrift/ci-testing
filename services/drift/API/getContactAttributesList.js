const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/contacts/attributes";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const getContactAttributesList = async () => {

	return axios
		.get(baseUrl, {
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
	getContactAttributesList,
};