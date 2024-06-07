const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/conversations/";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const getConversation = async (conversationId) => {
	try {
		const response = await axios
			.get(baseUrl + conversationId, {
				headers,
			})
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				console.log(err.message);
				return err;
			});
		return response;

	} catch (error) {
		console.log(error.message);
	}
};

module.exports = {
	getConversation,
};
