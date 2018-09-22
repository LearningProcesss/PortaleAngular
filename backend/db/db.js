const mongoose = require("mongoose");

//TEST ONLY
const { Ticket } = require("../models/ticket")
// const { PortalUser } = require("../models/portaluser")

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }).then(() => {

    const ret = Ticket.findById({})

    

    // Ticket.schema.eachPath((path, pathtype) => {
    //     console.log(path, pathtype);
    // })
    //console.log(Ticket.schema);
    
    // console.log("DB online!");
}).catch(err => console.log(err));

// mongoose
//   .connect(
//     "mongodb+srv://" + process.env.MONGO_ATLAS_USR + ":" + process.env.MONGO_ATLAS_PW + "@cluster0-qmyid.mongodb.net/mean-stack"
//   )
//   .then(result => {
//     console.log("Connessione mongo atlas riuscita.");
//   })
//   .catch(() => {
//     console.log("Connessione mongo atlas non riuscita.");
//   });

module.exports = { mongoose };