const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/users/list";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const getUserList = async () => {
	const headers = {
		Authorization: `Bearer UmnMVW9xWu4Bnwr1lfoPeHtz9JZ5IpSU`,
		"Content-Type": "application/json",
	};
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
	getUserList,
};