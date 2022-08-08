const User = require("../models/User");
const resp = require('../modules/responses');
const jwt = require("jsonwebtoken");

exports.Del = (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    console.log('Delete account request received');

    // vérifier si le token est valide et si le c'est bien son compte
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return resp.invalidCredentials('Invalid credentials', res);
    jwt.verify(token, process.env.KEY, (err, user) => {
        if (err) return resp.forbidden('Forbidden.', res);
        if (user.userId !== req.body.id) return resp.forbidden('Forbidden.', res);

        // supprimer le compte
        User.findByIdAndDelete(user.id, (err, user) => {
                if (err) return resp.internalError(err, res);
                return resp.success('Account deleted', res);
            }
        );
    })
}
