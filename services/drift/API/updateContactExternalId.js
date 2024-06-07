const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/contacts/normalize?idType=";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const updateContactExternalId = async (attributes, contactId, type = "external") => {

	let data = JSON.stringify(attributes);

	//Example event
	// {
	// 	"attributes": {"attribute_name": attribute_val}
	// }

	return axios
		.patch(baseUrl + type + "&id=" + contactId, data, {
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
	updateContactExternalId,
};