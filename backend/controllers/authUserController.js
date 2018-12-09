var { ObjectID } = require("mongodb")
const { PortalUser } = require("../models/portaluser")
const _ = require("lodash")
var d = require('debug')("app:portalUserController")

exports.signup = async (req, resp) => {

    try {
        const portalUser = new PortalUser(req.body)

        const ret = await portalUser.save()

        if (!_.isNull(ret) && !_.isUndefined(ret)) {
            resp.status(201).json({ id: ret._id })
        }

    } catch (error) {
        resp.status(500).json({ messaggioErrore: error })
    }
}

exports.signin = async (req, resp) => {

    const usr = await PortalUser.findOne({ email: req.body.email });

    d("signin", !_.isNull(usr) ? usr._id : -1)

    if (!usr) {
        return resp.status(404).json({ token: "", expire: 0, uId: "", messaggio: "Email errata o utente non registrato." });
    }

    try {

        var ret = await usr.compara(req.body.password);

        if (!ret) {
            return resp.status(404).json({ token: "", expire: 0, uId: "", messaggio: "Password errata." });
        }

        var tok = usr.creaToken();

        if (_.isNull(tok)) {
            return resp.status(500).json({ token: "", expire: 0, uId: "", messaggio: "Errore interno." });
        }

        usr.ultimoLogin = Date.now()
        await usr.save()

        resp.status(200).json({ token: tok, expire: 6600 * 1000, uId: usr._id, messaggio: "", authOk: true, nome: usr.fullName });

    } catch (error) {

        d("signin", error)

        resp.status(500).json({ token: "", expire: 0, uId: "", messaggio: "Errore autenticazione." });
    }
}