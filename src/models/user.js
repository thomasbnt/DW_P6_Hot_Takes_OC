const user = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const signupSchema = new user.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

signupSchema.plugin(uniqueValidator);

module.exports = user.model('User', signupSchema);
