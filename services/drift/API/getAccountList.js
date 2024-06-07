require('dotenv').config()
const DRIFT_AUTH_TOKEN = process.env.DRIFT_AUTH_TOKEN;
const axios = require("../../../util/axiosWithRetry");
const _ = require('lodash');
const baseUrl = "https://driftapi.com/accounts/?index=";
const headers = {
  Authorization: `Bearer ${DRIFT_AUTH_TOKEN}`,
  "Content-Type": "application/json",
};

//directly from lodash documentation used with .mergeWith method
function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

const getAccountList = async (index, size, url, data) => {

  //As this is a recursive function, we need to be able to pass it the previous data. 
  //Here we either used the passed in data, or we create a new objet to hold our data.
  data = data || {};
  url = url || baseUrl + index + "&size=" + size;

  await axios.get(url, { headers: headers })
    .then(response => {

      // We merge the returned data with the existing data
      _.mergeWith(data, response.data, customizer);

      // We check if there is more paginated data to be obtained
      if (response.data.data.next) {
        let newUrl = "https://driftapi.com" + response.data.data.next;
        return getAccountList(index, size, newUrl, data);
      }
    }).catch(err => {
      console.log("Error retrieving Accounts List");
      data = ({ data: { data: [] } }); //return an empty message array if an error occurs
    });

  return data;

};

module.exports = {
  getAccountList,
};