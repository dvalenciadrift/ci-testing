const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/users/update?userId=";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const updateUser = async (attributes, userId) => {

	let data = JSON.stringify(attributes);

	//Example attributes
	// {"attribute_name": attribute_val}

	return axios
		.patch(baseUrl + userId, data, {
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
	updateUser,
};