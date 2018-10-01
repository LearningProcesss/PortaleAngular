const { PortalUser } = require("../models/portaluser")
const _ = require("lodash")
var d = require('debug')("app:portalUserMiddleware")

module.exports = async (req, resp, next) => {

    if (_.isUndefined(req.headers) || _.isNull(req.headers.authorization) || _.isUndefined(req.headers.authorization)) {
        resp.status(401)

        next()
    }

    try {

        const tokenFrom = req.headers.authorization.split(" ")[1]

        // d("func", req.headers.authorization)

        const utente = await PortalUser.trovaByToken(tokenFrom)

        // d("func", (!_.isNull(utente) && !_.isUndefined(utente)) ? utente._id : -1)

        if (!_.isNull(utente) && !_.isUndefined(utente)) {

            req.utenteloggato = utente._id;

            return next()
        }
        else {
            return resp.status(401).send()
        }
    } catch (error) {
        resp.status(401).send()
        d("func", error)
    }
}