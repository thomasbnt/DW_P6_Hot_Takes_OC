const resp = require('../modules/responses');
const Sauces = require('../models/Sauce');
authenticateToken = require('../middlewares/authenticateToken');

/**
 * TODO :
 * CreateSauce
 */

exports.GetAllSauces = (req, res) => {
    console.log('GetAllSauces request received');
    Sauces.find().then(sauces => {
        resp.success(sauces, res);
    }).catch(err => {
        resp.notFound(res);
        console.error(err);
    })
}

exports.GetSaucesPerID = (req, res) => {
    console.log('Sauces per ID request received');
    Sauces.findOne({_id: req.params.id})
        .then(allSauces => resp.success(allSauces, res))
        .catch(error => resp.error(null, res))
};

exports.CreateSauce = (req, res) => {
    console.log('CreateSauce request received');
    /*
    * Exemple
    * {  "name": "Pas mal piquante",  "manufacturer": "Mexique",  "description": "Je pique pas mal",  "mainPepper": "Piment pimenté",  "imageUrl": "localhost/imaage.png",  "heat": 0}
     */
    const newSauce = JSON.parse(req.body.sauce)
    /*console.log(req.protocol + '://' + req.get('host'));*/
    const sauce = new Sauces({
        name: newSauce.name,
        manufacturer: newSauce.manufacturer,
        description: newSauce.description,
        mainPepper: newSauce.mainPepper,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${newSauce.imageUrl}`,
        heat: newSauce.heat,

        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    if (newSauce.heat >= 0 && newSauce.heat <= 10) {

        sauce.save()
            .then(() => resp.success(sauce, res))
            .catch((err) => {
                    let errMess
                    if (err._message === undefined) {
                        errMess = 'Missing parameters';
                    } else {
                        errMess = err._message;
                    }
                    resp.error(`Error : ${errMess}.`, res)
                    console.log(err)
                }
            );
    } else {
        resp.error('Heat must be between 0 and 10.', res);
    }
}

exports.UpdateSauce = (req, res) => {
    console.log('UpdateSauce request received');
    Sauces.updateOne(
        {_id: req.params.id},
        {...req.body, _id: req.params.id}
    ).then(updatedSauce => {
        if (updatedSauce.modifiedCount === 0) return resp.error('Sauce not modified because no body here or badly written.', res);
        resp.success(updatedSauce, res)
    }).catch(err => {
        console.log(err);
        resp.error('Error while updating sauce.', res)
    })
};

exports.DeleteSauce = (req, res) => {
    console.log('DeleteSauce request received');
    Sauces.findOneAndDelete({_id: req.params.id})
        .then(() => resp.success('Sauce deleted', res))
        .catch(resp.error('Maybe the ID isn\'t on database or badly written.', res))
};

exports.LikeSauce = (req, res) => {
    console.log('LikeSauce request received');
    Sauces.findOne({_id: req.params.id})
        .then(sauce => {
            console.log({sauce})
            const body = req.body;
            if (!body.userId || (body.like <= -1 && body.like >= 1))
                return resp.error('Missing parameters userId/like', res);
            // Si le userId like
            if (body.like === 1) {
                sauce.likes++;
                sauce.usersLiked.push(body.userId);
                resp.success(sauce, res);
            }
            // Si le userId dislike
            if (body.like === -1) {
                sauce.dislikes++;
                sauce.usersDisliked.push(body.userId);
                resp.success(sauce, res);
            }
            // Si le userId n'a pas liké ou dislike
            if (body.like === 0) {
                resp.success(sauce, res);
            }
        })
        .catch(error => res.status(400).json({error}))

}
