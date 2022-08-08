const User = require("../models/User");
const resp = require('../modules/responses');
const jwt = require("jsonwebtoken");

exports.Del = (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    console.log('Delete account request received');
    const id = Number(req.body.userId);
    if (!id) return resp.error('No id provided', res);
    User.deleteOne({_id: id})
        .then(response => {
                console.log(response);
                if (response.deletedCount === 1) {
                    resp.success('Account deleted', res);
                }
                else {
                    resp.error('Account not found. Please use "userId".', res);
                }
            }
        )
}
