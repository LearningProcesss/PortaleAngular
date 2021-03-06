const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator")

var d = require('debug')("app:AziendaSchema")

const schema = mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    }
})

schema.plugin(uniqueValidator)

var Azienda = mongoose.model('Azienda', schema);

module.exports = { Azienda };