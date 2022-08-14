const resp = require('../modules/responses');
const Sauces = require('../models/Sauce');
authenticateToken = require('../middlewares/authenticateToken');

exports.GetAllSauces = (req, res) => {
    console.info('GetAllSauces request received');
    // On récupère toutes les sauces
    Sauces.find().then(sauces => {
        res.status(200).json(sauces);
    }).catch(err => {
        resp.notFound(res);
        console.error(err);
    })
}

exports.GetSaucesPerID = (req, res) => {
    console.info('Sauces per ID request received');

    // req.params.id doit être un string de 24 caractères
    if (req.params.id.length !== 24) return resp.error('ID badly written.', res);

    // On récupère une sauce par son ID
    Sauces.findOne({_id: req.params.id})
        .then((allSauces) => {
            if (allSauces === null) return resp.error('Sauce not found.', res);
            res.status(200).json(allSauces);
        })
};

exports.CreateSauce = (req, res) => {
    console.info('CreateSauce request received');
    let errorParams = false;
    const newSauce = JSON.parse(req.body.sauce);

    // On vérifie que les paramètres sont bien renseignés
    if (
        (!newSauce.name || !newSauce.manufacturer || !newSauce.description || !newSauce.mainPepper || !req.file || !newSauce.heat)
        && ((newSauce.heat >= 0) && (newSauce.heat <= 10))
    ) {
        // Si les paramètres sont mal renseignés, alors erreur
        errorParams = true;
        resp.error('Missing parameters on your request.', res)
    }

    // Si dans le cas présent aucune erreur, alors on crée la sauce
    if (!errorParams) {
        const sauce = new Sauces({
            ...newSauce,
            userId: req.user.userId,
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
        // Et on l'enregistre dans la base de données
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

    // Check if the userID of the sauce is the same as the userID of the token
    if (req.user.userId !== req.body.userId) return resp.error('You can\'t update this sauce.', res);

    const updatedSauce = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : req.body

    // On vérifie que l'ID ciblé est bien présent dans la base de données
    Sauces.updateOne(
        {_id: req.params.id},
        {...updatedSauce, _id: req.params.id}
    ).then((sauce) => {
        // Si l'ID est présent, alors on met à jour la sauce
        if (sauce.modifiedCount === 0) return resp.error('Sauce not modified because no body here or badly written.', res);
        res.status(200).json(updatedSauce);
    }).catch(err => {
        console.log(err);
        resp.conflict('Error while updating sauce.', res)
    })
};

exports.DeleteSauce = (req, res) => {
    console.log('DeleteSauce request received');
    // On vérifie que l'ID ciblé est bien présent dans la base de données
    Sauces.deleteOne({_id: req.params.id})
        .then((response) => {
            // Si aucune modification n'a été faite, alors on renvoie une erreur
            if (response.deletedCount === 0) return resp.error('Sauce not found or already deleted.', res);
            // Et si c'est le cas, on supprime la sauce
            return resp.success('Sauce deleted', res)
        })
        .catch(() => {
            return resp.error('Maybe the ID isn\'t on database or badly written.', res)
        })
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
            // Si la sauce n'existe pas
            if (sauce === null) return resp.error('Sauce not found', res);

            const isLikedByUserId = sauce.usersLiked.includes(likeSauce.userId);
            const isDislikedByUserId = sauce.usersDisliked.includes(likeSauce.userId);

            // Si req.body.like vaut 1
            if (likeSauce.like === 1) {
                // Si u a déjà liké la sauce
                if (isLikedByUserId) {
                    console.log('already liked')
                    return resp.error('You already liked this sauce.', res)
                } else if (isDislikedByUserId) {
                    sauce.likes += 1;
                    sauce.dislikes -= 1;
                    sauce.usersLiked.push(likeSauce.userId);
                    sauce.usersDisliked.remove(likeSauce.userId);
                    sauce.usersDisliked = sauce.usersDisliked.filter(userId => userId !== likeSauce.userId);
                    sauce.save().then(() => resp.success(sauce, res)).catch(err => {
                            console.log(err);
                            resp.error('Error while updating sauce.', res)
                        }
                    )
                } else {
                    sauce.likes += 1;
                    sauce.usersLiked.push(likeSauce.userId);
                    sauce.save().then(() => resp.success(sauce, res)).catch(err => {
                            console.log(err);
                            resp.error('Error while updating sauce.', res)
                        }
                    )
                }
            }
            // Si req.body.like vaut -1
            else if (likeSauce.like === -1) {
                // Si l'utilisateur a déjà liké la sauce
                if (isLikedByUserId) {
                    // Cet utilisateur n'aimait pas cette sauce, il peut donc l'aimer.
                    // On supprime l'id de l'utilisateur dans usersDisliked
                    sauce.usersLiked.remove(likeSauce.userId);
                    // On ajoute l'id de l'utilisateur dans usersLiked
                    sauce.usersDisliked.push(likeSauce.userId);
                    // On diminue le nombre de likes de la sauce
                    sauce.likes--;
                    sauce.dislikes++;
                    // On met à jour la sauce
                    Sauces.updateOne({_id: sauce._id}, sauce).then(() => resp.success(sauce, res)).catch(err => {
                        console.log(err);
                        resp.error('Error while updating sauce.', res)
                    })
                }
                // Si l'utilisateur a déjà marqué comme il n'aimait pas la sauce
                else if (isDislikedByUserId) {
                    return resp.error('You already disliked this sauce.', res)
                } else {
                    // User never disliked this sauce
                    sauce.dislikes += 1;
                    sauce.usersDisliked.push(likeSauce.userId);
                    sauce.usersLiked = sauce.usersLiked.filter(userId => userId !== likeSauce.userId);
                    sauce.save().then(() => resp.success(sauce, res)).catch(err => {
                            console.log(err);
                            resp.error('Error while updating sauce.', res)
                        }
                    )
                }
            }
            // Si req.body.like vaut 0
            else if (likeSauce.like === 0) {
                // Si l'utilisateur a déjà liké la sauce
                if (isLikedByUserId) {
                    sauce.usersLiked.remove(likeSauce.userId);
                    sauce.likes--;
                    sauce.save().then(() => resp.success(sauce, res)).catch(err => {
                            console.log(err);
                            resp.error('Error while updating sauce.', res)
                        }
                    )
                }
                // Si l'utilisateur a déjà marqué comme il n'aimait pas la sauce
                else if (isDislikedByUserId) {
                    sauce.usersDisliked.remove(likeSauce.userId);
                    sauce.dislikes--;
                    sauce.save().then(() => resp.success(sauce, res)).catch(err => {
                            console.log(err);
                            resp.error('Error while updating sauce.', res)
                        }
                    )
                }
                // Si l'utilisateur n'a jamais aimé ou n'aime pas la sauce
                else {
                    return resp.error('You never liked or disliked this sauce.', res)
                }
            } else {
                resp.error('Like must be a number between -1 and 1.', res);
            }
        }).catch((err) => {
        console.log({err})
    })
}
