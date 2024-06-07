const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const baseUrl = "https://driftapi.com/playbooks/list";
const headers = {
	Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
	"Content-Type": "application/json",
};

const getPlaybookName = async (playbookId) => {

	const playbookList = await axios
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

	let pb = playbookList.find(pb => pb.id == playbookId)

	let playbookName = pb ? pb.name : "Unknown"

	return playbookName;

};

module.exports = {
	getPlaybookName,
};
