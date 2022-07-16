const signup = require("../models/user");
const resp = require('../modules/responses');
const validateEmailAndPassword = require("../modules/validateEmailAndPassword");

exports.UserController = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    console.log('Signup request received');
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
                console.log('Email already exists');
                return resp.error('Email already exists', res);
            }
            if (findEmail === null) {
                // si l'email n'est pas dans la base de donnée, alors on crée un nouvel utilisateur
                const newUser = new signup({
                    email: email,
                    password: password
                });
                newUser.save()
                    .then(() => {
                        console.log('A new signup has been created');
                        resp.success('Success: You are now signed up on Hot Takes.', res);
                    })
                    .catch(err => {
                        console.error(err);
                        resp.error("An error occurred while creating a new signup", res);
                    });
            }
        })
    } else {
        console.log('Email or password is not valid');
        !emailIsValid ? resp.error('Error: Email is required or you typed it wrong.', res) : null;
        !passwordIsValid ? resp.error('Error: Password is required (Make sure that you put at least 6 characters for security reasons).', res) : null;
    }
}
