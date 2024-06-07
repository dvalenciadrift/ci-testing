const serverlessExpress = require('@vendia/serverless-express')
const app = require('./app')

//Lambda required module "handler".  
exports.handler = serverlessExpress({ app })