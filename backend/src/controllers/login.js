const signup = require("../models/User");
const resp = require('../modules/responses');
const validateEmailAndPassword = require('../modules/validateEmailAndPassword');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.UserController = (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    console.log('Login request received');
    const email = req.body.email;
    const password = req.body.password;

    validateEmailAndPassword.checkEmail(email)
    validateEmailAndPassword.checkPassword(password)

    const emailIsValid = validateEmailAndPassword.checkEmail(email);
    const passwordIsValid = validateEmailAndPassword.checkPassword(password);

    // On vérifie si l'email et le password est bien renseigné
    if (emailIsValid && passwordIsValid) {
        // si l'email est déjà dans la base de donnée, alors erreur
        signup.findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    resp.invalidCredentials('Invalid credentials', res);
                } else {
                    // On compare le mot de passe dans la base de donnée et celui qu'on envoie en paramètre
                    bcrypt.compare(password, user.password)
                        .then(userFounded => {
                            if (!userFounded) {
                                resp.invalidCredentials('Invalid credentials', res);
                            } else {
                                res.status(200).json({
                                    userId: user._id,
                                    token: jwt.sign(
                                        {userId: user._id},
                                        process.env.KEY,
                                        {expiresIn: '1d'}
                                    )
                                })
                            }
                        }).catch(error => {
                            console.log(error);
                            resp.internalError(error, res);
                        }
                    );
                }
            }).catch(error => resp.internalError(error, res))
    } else {
        // Si l'email ou le password n'est pas renseigné, alors erreur
        console.log('Email or password is not valid');
        !emailIsValid ? resp.invalidCredentials('Error: Email is required or you typed it wrong.', res) : null;
        !passwordIsValid ? resp.invalidCredentials('Error: Password is required.', res) : null;
    }
}
