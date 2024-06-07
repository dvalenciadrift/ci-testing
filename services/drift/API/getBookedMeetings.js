const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/users/meetings/org?min_start_time=";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const getBookedMeetings = async (conversation) => {

	const createdAtEpoch = conversation.data.createdAt;

	const meetingList = await axios
		.get(baseUrl + createdAtEpoch + `&max_start_time=15000000000000`, {
			headers,
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.log(`Error retrieving booked meetings for conversation $conversation.data.id: `, err);
			return err
		});

	return meetingList;

};

module.exports = {
	getBookedMeetings,
};
