const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/conversations/new";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const createConversation = async (conversation) => {

	let data = JSON.stringify(conversation);

	//Example conversation
	// {
	// 	"email": "yourcontact@email.com",
	// 	"message": {
	// 		"body": "A conversation was started <a href='www.yoururl.com'>here</a>, let's resume from drift!",
	// 		"attributes": {
	// 			"integrationSource": "Message from facebook",
	//      "autoAssigneeId": 21849
	// 		}
	// 	}
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
	createConversation,
};