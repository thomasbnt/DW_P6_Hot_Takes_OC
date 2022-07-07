const mongooseSignup = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const signupSchema = new mongooseSignup.Schema({
    userId: {type: Number, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

signupSchema.plugin(uniqueValidator);

module.exports = mongooseSignup.model('User', signupSchema);
