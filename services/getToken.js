const axios = require('../util/axiosWithRetry');
const stageName = process.env.ENVIRONMENT || "qa";

let baseUrl = "";
if (stageName === "qa") {
  baseUrl = `https://dxxnqx40l8.execute-api.us-east-1.amazonaws.com/qa/api/getDriftToken`
} else {
  baseUrl = 'https://z5bjhgefjc.execute-api.us-east-1.amazonaws.com/prod/api/getDriftToken'
}

const getToken = async (orgId) => {
  console.log("BaseUrl: ", baseUrl)
  const body = JSON.stringify({
    "api-key": process.env.DRIFT_AUTH_API_KEY,
    "org-id": orgId,
    "app-name": "jokebot"
  })

  const config = {
    method: 'post',
    url: baseUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    data: body
  };

  return axios(config)
    .then((res) => {
      return res.data
    }).catch(err => {
      console.log(err);
      return err
    })
}

module.exports = {
  getToken
}

