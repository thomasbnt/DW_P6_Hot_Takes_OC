const resp = require('../modules/responses');
authenticateToken = require('../modules/authenticateToken');

exports.SaucesController = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    console.log('Sauces request received');
    authenticateToken.authToken(req, res, next);
    next();
}
