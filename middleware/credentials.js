const allowedOrigins = require('../config/allowedOrigins');


// if request came from domain that we allow, set allow credentials to true, so browser can use response
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.headers('Access-Control-Allow-Credentials', true);
    }
    next();
};

module.exports = credentials;