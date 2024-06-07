require('dotenv').config()
const axios = require('./axiosWithRetry');


const postSlackErrorMessage = async (orgId, appName, errMessage) => {
  let block = buildBlock(orgId, appName, errMessage);
  var data = JSON.stringify({
    "channel": "C04E8FK3YEA", //#pse-custom-app-error-alerts
    "blocks": [
      block
    ]
  });

  var config = {
    method: 'POST',
    url: 'https://slack.com/api/chat.postMessage',
    headers: {
      'Authorization': `Bearer ${process.env.SLACK_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: data
  };
  console.log("Config: ", config)
  let reply = await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log("Error posting Slack Error Message.", error);
    });
  return reply
}

const buildBlock = (orgId, appName, errMessage) => {
  if (process.env.ENVIRONMENT === "prod") {
    return {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `:ablobonfire::warning::ablobonfire::warning::ablobonfire::warning:` +
          `:ablobonfire::warning::ablobonfire::warning::ablobonfire::warning:\n\n@channel *${appName}* is ` +
          `having issues.\n*Error Message* is "${errMessage}"\n*Org Id Impacted* is ${orgId}.\n\n` +
          `:ablobonfire::warning::ablobonfire::warning::ablobonfire::warning::ablobonfire::warning:` +
          `:ablobonfire::warning::ablobonfire::warning:`
      }
    }
  } else {
    return {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `:ablobonfire::ok::ablobonfire::ok::ablobonfire::ok:` +
          `:ablobonfire::ok::ablobonfire::ok::ablobonfire:` +
          `:ok:\n\n@here *THIS IS A QA ERROR*\n *${appName}* is ` +
          `having issues.\n*Error Message* is "${errMessage}"\n*Org Id Impacted* is ${orgId}.\n\n` +
          `:ablobonfire::ok::ablobonfire::ok::ablobonfire::ok::ablobonfire::ok:` +
          `:ablobonfire::ok::ablobonfire::ok:`
      }
    }
  }

}

module.exports = {
  postSlackErrorMessage
}