//Configure the retries for all uses of axios
const axios = require("axios");
const axiosRetry = require('axios-retry').default;

// Initialize axios-retry with custom settings
axiosRetry(axios, {
  retries: 5, // Number of retries
  retryDelay: (retryCount) => {
    console.log(`Retry attempt #${retryCount}`);
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    // Log all attempts, including those that will be retried
    console.log(`Attempted request failed with status: ${error.response ? error.response.status : 'Network error'}`);

    // Retry on any error, regardless of status code
    return true;
  }
});

module.exports = axios;