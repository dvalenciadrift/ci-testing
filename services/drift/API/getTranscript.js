const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/conversations/";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const getTranscript = async (conversationId) => {
	return axios
		.get(baseUrl + conversationId + `/transcript`, {
			headers,
		})
		.then(async (res) => {
			return res.data;
		})
		.catch((err) => {
			console.log(err.message);
		});
};

module.exports = {
	getTranscript,
};
