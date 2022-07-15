const user = require('mongoose');

const signupSchema = new user.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

module.exports = user.model('User', signupSchema);
