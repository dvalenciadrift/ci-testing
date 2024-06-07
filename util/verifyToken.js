const { error } = require('./error');

const verifyToken = async function(req, res, next){
  const token = req.body['token'];
    
  if (!token) return next(error(400, 'Drift verification token required'));

  // key is invalid
  if (process.env.DRIFT_VERIFICATION_TOKEN !== token){
  
    return next(error(401, 'Invalid Drift verification token'))
  } 
  //all good, continue
  next();
}

module.exports = {
  verifyToken
}