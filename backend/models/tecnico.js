const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        required: true
    },
    password: {
        type: String,
        required: true
    },
    azienda: {
        type: String,
        required: true
    },
    registratoIl: {
        type: Date,
        default: Date.now()
    },
    ultimoLogin: {
        type: Date
    }
});

schema.methods.compara = async function (passwordFrom) {

    var tecnico = this;

    try {
        var ret = await bcrypt.compare(passwordFrom, tecnico.password);
        return ret;
    } catch (error) {

    }
};

schema.methods.creaToken = function () {

    var tecnico = this;

    var token = jwt.sign({
        email: tecnico.email, id: tecnico._id
    }, process.env.KEY, { expiresIn: "1h" });

    return token;
}

schema.statics.trovaByToken = async function (tokenFrom) {

    var user = this;
    var decoded;

    try {
        decoded = jwt.verify(tokenFrom, process.env.KEY);
    } catch (error) {

    }

    return await User.findOne({ _id: decoded.id });
};

schema.pre("save", function (next) {

    var tecnico = this;

    bcrypt.genSalt(5).then((salt) => {
        bcrypt.hash(tecnico.password, salt).then((hash) => {
            tecnico.password = hash;
            next();
        }).catch((error) => {

        });
    });
});

var Tecnico = mongoose.model('Tecnico', schema);

module.exports = { Tecnico };