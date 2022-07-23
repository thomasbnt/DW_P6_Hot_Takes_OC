const resp = require('../modules/responses');
const Sauces = require('../models/Sauce');
authenticateToken = require('../middlewares/authenticateToken');

exports.GetAllSauces = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    console.log('GetAllSauces request received');
    authenticateToken.authToken(req, res, next);
    Sauces.find().then(sauces => {
        resp.success(sauces, res);
    }).catch(err => {
        resp.notFound(res);
        console.error(err);
    })
}

exports.GetSaucesPerID = (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    console.log('Sauces per ID request received');
    authenticateToken.authToken(req, res);
}
exports.CreateSauce = (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    console.log('Create sauce request received');
    authenticateToken.authToken(req, res);
    const sauce = req.body
    if (sauce.heat >= 0 && sauce.heat <= 10) {
        const newSauce = new Sauces({
            name: sauce.name,
            manufacturer: sauce.manufacturer,
            description: sauce.description,
            mainPepper: sauce.mainPepper,
            heat: sauce.heat,
            imageUrl: sauce.imageUrl,
        });
        newSauce.save()
            .then(() => {
                console.log('A new sauce has been created');
                resp.success('Success: You are created a new sauce on Hot Takes.', res);
            })
            .catch(err => {
                resp.conflict(`An error occurred while creating a new sauce. This name of sauce already exist.`, res);
                console.error(err.message);
            });
    } else {
        console.log('Heat is not valid');
        resp.error('Error: Heat is not valid. Must be between 0 and 10.', res);
    }

}
