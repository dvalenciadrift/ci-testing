//in the atmos recipes the lambda is created with a local ENVIRONMENT variable or "prod" or "qa"
//this check allows for local dev, but will be ignored in the Lambda runtime environment

const setEnvironment = ()=>{
  if (!process.env.ENVIRONMENT){
    //for local dev
    process.env.DRIFT_AUTH_TOKEN = "abcdefg"
    process.env.ENVIRONMENT = "qa";
    process.env.DRIFT_AUTH_API_KEY = "set in the pse-app-secrets-qa DynamoDb table"
    process.env.DRIFT_VERIFICATION_TOKEN="set in the Drift dev portal where the app lives"
  } else if (process.env.ENVIRONMENT === "qa"){
    //qa on AWS
    process.env.DRIFT_AUTH_TOKEN = "abcdefghijklmnop"
    process.env.DRIFT_AUTH_API_KEY = "set in the pse-app-secrets-qa DynamoDb table"
    process.env.DRIFT_VERIFICATION_TOKEN="set in the Drift dev portal where the app lives"
  } else {
    //prod on AWS
    process.env.DRIFT_AUTH_TOKEN = "abcdefghijklmnopqrstuvwxyz"
    process.env.DRIFT_AUTH_API_KEY = "set in the pse-app-secrets-prod DynamoDb table"
    process.env.DRIFT_VERIFICATION_TOKEN="set in the Drift dev portal where the app lives"
  }
}

module.exports = {
  setEnvironment
}