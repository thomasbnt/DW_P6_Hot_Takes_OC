const signup = require("../models/user");
const resp = require('../modules/responses');
const validateEmailAndPassword = require('../modules/validateEmailAndPassword');
const createToken = require('../modules/createToken');

exports.UserController = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    console.log('Login request received');
    const email = req.body.email;
    const password = req.body.password;

    validateEmailAndPassword.checkEmail(email)
    validateEmailAndPassword.checkPassword(password)

    const emailIsValid = validateEmailAndPassword.checkEmail(email);
    const passwordIsValid = validateEmailAndPassword.checkPassword(password);

    if (emailIsValid && passwordIsValid) {
        // si l'email est déjà dans la base de donnée, alors erreur
        signup.findOne({
            email: email
        }).then(findEmail => {
            if (findEmail) {
                // si le password correspond, alors ok
                if (findEmail.password === password) {
                    const tokenGenerated = createToken.gen(findEmail._id);
                    resp.success({userId: findEmail._id, token: tokenGenerated}, res);
                } else {
                    resp.invalidCredentials(res);
                }
            }
            if (findEmail === null) {
                // si l'email n'est pas dans la base de donnée, alors affiche une erreur
                resp.invalidCredentials(res);
            }
        })
    } else {
        console.log('Email or password is not valid');
        !emailIsValid ? resp.error('Error: Email is required or you typed it wrong.', res) : null;
        !passwordIsValid ? resp.error('Error: Password is required.', res) : null;
    }
}
