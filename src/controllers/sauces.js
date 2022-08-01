const resp = require('../modules/responses');
const Sauces = require('../models/Sauce');
authenticateToken = require('../middlewares/authenticateToken');

exports.GetAllSauces = (req, res) => {
    console.info('GetAllSauces request received');
    Sauces.find().then(sauces => {
        resp.success(sauces, res);
    }).catch(err => {
        resp.notFound(res);
        console.error(err);
    })
}

exports.GetSaucesPerID = (req, res) => {
    console.info('Sauces per ID request received');
    Sauces.findOne({_id: req.params.id})
        .then((allSauces) => {
            if (allSauces === null) return resp.error('Sauce not found.', res);
            resp.success(allSauces, res);
        })
};

exports.CreateSauce = (req, res) => {
    console.info('CreateSauce request received');
    let errorParams = false;
    const newSauce = JSON.parse(req.body.sauce);

    if (
        (!newSauce.name || !newSauce.manufacturer || !newSauce.description || !newSauce.mainPepper || !req.file || !newSauce.heat)
        && ((newSauce.heat >= 0) && (newSauce.heat <= 10))
    ) {
        errorParams = true;
        resp.error('Missing parameters on your request.', res)
    }

    if (!errorParams) {
        const sauce = new Sauces({
            ...newSauce,
            name: newSauce.name,
            manufacturer: newSauce.manufacturer,
            description: newSauce.description,
            mainPepper: newSauce.mainPepper,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
            heat: newSauce.heat,

            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
        });
        sauce.save()
            .then(() => resp.created(sauce, res))
            .catch((err) => {
                    let errMess
                    if (err._message === undefined) {
                        errMess = 'Missing parameters.';
                    } else {
                        errMess = err._message;
                    }
                    resp.error(`Error : ${errMess}.`, res)
                    console.log(err)
                }
            );
    }
}

exports.UpdateSauce = (req, res) => {
    console.info('UpdateSauce request received');
    if (!req.body.sauce) return resp.error('Missing parameters', res);

    const updatedSauce = JSON.parse(req.body.sauce)
    console.log({updatedSauce})

    Sauces.updateOne(
        {_id: req.params.id},
        {updatedSauce, _id: req.params.id}
    ).then((sauce) => {
        console.log({sauce})
        console.log({sauceModifiedCount: sauce.modifiedCount})
        if (sauce.modifiedCount === 0) return resp.error('Sauce not modified because no body here or badly written.', res);

        resp.success(sauce, res)
    }).catch(err => {
        console.log(err);
        resp.conflict('Error while updating sauce.', res)
    })
};

exports.DeleteSauce = (req, res) => {
    console.log('DeleteSauce request received');
    Sauces.findOneAndDelete({_id: req.params.id})
        .then(() => resp.success('Sauce deleted', res))
        .catch(resp.error('Maybe the ID isn\'t on database or badly written.', res))
};

exports.LikeSauce = (req, res) => {
    console.info('LikeSauce request received');

    const likeSauce = req.body;
    // On vérifie si userId est dans le body
    if (!likeSauce.userId) return resp.error('Missing parameter userId as a string', res);
    // On vérifie si like est dans le body et qu'il ne vaut pas 0
    if (!likeSauce.like && (likeSauce.like !== 0)) {
        return resp.error('Missing parameter like as a number between -1 and 1.', res);
    }


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
