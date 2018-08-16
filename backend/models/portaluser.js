const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator")

var d = require('debug')("app:PortalUserSchema")

const schema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    cognome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    registratoIl: {
        type: Date,
        default: Date.now()
    },
    ultimoLogin: {
        type: Date
    },
    numeroTelefono: {
        type: Number
    },
    tipo: {//0 utente 1 tecnico
        type: Number
    },
    _azienda: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Azienda'
        // ,
        // required: true
    }
});

schema.methods.compara = async function (passwordFrom) {

    var portaluser = this;

    try {
        var ret = await bcrypt.compare(passwordFrom, portaluser.password);
        d("compara", ret)
        return ret;
    } catch (error) {
        d("compara", error)
    }
};

schema.methods.creaToken = function () {

    var portaluser = this;

    try {
        var token = jwt.sign({
            email: portaluser.email, id: portaluser._id
        }, process.env.JWT_SECRET, { expiresIn: "12h" })

        d("creaToken", token)
        return token;
    } catch (error) {
        d("creaToken", error)
    }

    return null
}

schema.statics.trovaByToken = async function (tokenFrom) {

    var decoded = {};

    try {

        decoded = jwt.verify(tokenFrom, process.env.JWT_SECRET);
        d("trovaByToken", decoded)
        if (_.isNull(decoded) || _.isUndefined(decoded)) {
            return await new Promise((resolve, reject) => {
                resolve(null)
            })
        }

    } catch (error) {

    }

    return await PortalUser.findOne({ _id: decoded.id });
};


schema.virtual('fullName').get(function () {
    return this.nome + ' ' + this.cognome
});

schema.pre("save", function (next) {

    var portaluser = this;

    if (!portaluser.isModified('password')) return next()

    bcrypt.genSalt(5).then((salt) => {
        bcrypt.hash(portaluser.password, salt).then((hash) => {
            d("pre", salt)
            portaluser.password = hash;
            next();
        }).catch((error) => {

        });
    });
})

schema.plugin(uniqueValidator)

var PortalUser = mongoose.model('PortalUser', schema);

module.exports = { PortalUser };