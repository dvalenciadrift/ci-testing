require('dotenv').config()
const express = require('express')
const app = express()
const { yourService } = require('./services/yourService.js')
const { setEnvironment } = require('./util/setEnvironment')
const { verifyToken } = require('./util/verifyToken')

setEnvironment();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', verifyToken);  //checks for verification token in request


// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.post('/your_route', yourService)

if (!process.env.LAMBDA_TASK_ROOT) {
  app.listen(3000, () => console.log(`App initialized on port: 3000`));
}

// Export your express server so you can import it in the lambda function.
module.exports = app