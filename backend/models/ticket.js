const mongoose = require('mongoose')
const _ = require('lodash');
const d = require('debug')("app:TicketSchema")

const testSchema = new mongoose.Schema({
    propAA: {
        type: String
    },
    propBB: {
        type: Number
    }
})

var TicketSchema = mongoose.Schema({
    titolo: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    stato: {
        type: String,
        enum: ['Aperto', 'Chiuso', 'Sospeso', 'Verifica Tecnica', 'In attesa di risposta'],
        default: 'Aperto'
    },
    prio: {
        type: String,
        enum: ['Non urgente', 'Urgente', 'Blocco sistema'],
        default: 'Non urgente',
        required: true
    },
    task: {
        type: String,
        enum: ['Installazione modulo', 'Configurazione', 'Sviluppo custom', 'Manutenzione', 'Altro'],
        default: 'Altro',
        required: true
    },
    // _idPrio: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Prio'
    // },
    // _idTask: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Task'
    // },
    // _idCliente: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Cliente'
    // },
    // _idTecnico: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Tecnico'
    // },
    // _idStato: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Stato'
    // },
    creatoIl: {
        type: Date,
        default: Date.now()
    },
    modificatoIl: {
        type: Date
    },
    chiusoIl: {
        type: Date
    },
    ticketProcad: {
        type: Number
    },
    risoluzione: {
        type: String,
        trim: true
    },
    visualizzatoIl: {
        type: Date
    },
    visualizzatoDa: {
        type: String
    },
    _cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PortalUser',
        required: true
    },
    _tecnico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PortalUser'
        // required: true
    },
    eventi: [{
        testo: {
            type: String,
            trim: true
        },
        creatoDa: {
            type: String,
            trim: true
        },
        creatoIl: {
            type: Date,
            default: Date.now()
        },
        file: {
            type: String
        }
    }],
    oggettoTest: {
        propA: {
            type: String
        },
        propB: {
            type: Number
        },
        propC: {
            type: Date
        }
    },
    subOggetto: {
        type: testSchema
    }
});


TicketSchema.pre('update', function (next) {

    var ticket = this;

    ticket.modificatoIl = Date.now()

    // if (_.isUndefined(ticket._idStato)) {
    //     Stato.findOne({ nome: 'Inbox' }).then((stato) => {
    //         console.log('********', stato);

    //         ticket._idStato = stato._id;

    //         console.log('**************', ticket);

    //         next();

    //     });
    // }

    next()
})

let Ticket = mongoose.model('Ticket', TicketSchema);



module.exports = { Ticket };