const resp = require('../modules/responses');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization.split(' ')[1];
         if (authHeader == null) {
             return resp.invalidCredentials(res);
         }

        const token = jwt.verify(authHeader, `${process.env.KEY}`);
        const userId = token.userId;
        req.auth = {user: userId}
        next();
    } catch (error) {
        console.log(error);
        return resp.invalidCredentials(res);
    }
}
