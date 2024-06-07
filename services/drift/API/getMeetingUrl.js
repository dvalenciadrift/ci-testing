const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/users/meetings/org?min_start_time=0&max_start_time=15000000000000";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const getMeetingUrl = async (slug) => {

	const meetingList = await axios
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

	let meeting = meetingList.data.find(mtg => mtg.slug === slug)

	let meetingUrl = meeting ? meeting.conferenceDetails?.join_url : "Unknown"

	return meetingUrl;

};

module.exports = {
	getMeetingUrl,
};
