const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/conversations/";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const createMessage = async (message, conversationId) => {

	let data = JSON.stringify(message);

	//Example message
	// {
	// 	"type": "chat",    //or "private_note"
	// 	"body": "string",  //(optional)
	// 	"buttons": [       //(optional)
	// 		 {"value": "yes please",
	// 			"label": "yes please",
	// 			"type": "reply"}], 
	// 	"userId": 12345    //(optional)
	// }

	return axios
		.post(baseUrl + conversationId + "/messages", data, {
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
	createMessage,
};
