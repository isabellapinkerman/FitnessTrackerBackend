

function requireUser(req, res, next){
    if (!req.user){
        res.status(401);
        next({
            name: "MissingUserError",
            message: "You must be logged in to perform this action"
        })
    }
    next();
}

function objectOwner(req, res, next){
    if (req.user.id !== routine.creatorId){
        res.status(403);
        next({
            name: "OwnerUserError",
            message: "Owner of routine must be logged in to perform this action"
        })
    }
    next();

}

module.exports = {
    requireUser,
    objectOwner
}