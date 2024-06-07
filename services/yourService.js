const axios = require('../util/axiosWithRetry');
const { postSlackErrorMessage } = require('../util/postSlackErrorMessage')
const { getToken } = require('./getToken');
const baseUrl = 'https://driftapi.com/conversations/'

const yourService = async (req, res) => {
  const joke = "await getJoke()";
  let driftToken, bearerToken;
  const { orgId, type = "", data = {} } = req.body;
  const convoId = data.conversationId

  if (type === "new_command_message" && data.body === "/joke") {
    driftToken = await getToken(orgId);
    bearerToken = driftToken.Item.access_token;
  }

  const body = JSON.stringify({
    "type": "chat",
    "body": joke
  })

  const config = {
    method: 'post',
    url: baseUrl + convoId + "/messages",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    },
    data: body
  };

  axios(config)
    .then((response) => {

    }).catch(err => {
      console.log(err);
      postSlackErrorMessage(orgId, "<Your App Name Here>", err.message)
    })

}

module.exports = {
  yourService
}