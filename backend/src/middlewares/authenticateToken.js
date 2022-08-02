const resp = require('../modules/responses');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log({tokenauthHeader :token});
        if (token === null) return resp.invalidCredentials('Invalid credentials', res);

        jwt.verify(token, process.env.KEY, (err, user) => {
            if (err) return resp.forbidden('Forbidddden', res);
            req.user = user;
            next();
        })


    } catch (error) {
        console.log(error);
        return resp.internalError(error, res);
    }
}
