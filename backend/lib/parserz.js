const { ObjectID } = require("mongodb")
const _ = require("lodash");

exports.Parze = (schemaModel, requestBody) => {

    // const propSchema = _.keys(schemaModel);

    // console.log(propSchema);

    // const propReq = _.keys(requestBody);

    // console.log(propReq);

    var obj = {};

    _.intersection(_.keys(schemaModel), _.keys(requestBody)).forEach((prop) => { obj[prop] = requestBody[prop] });

    console.log(obj);

    return obj;
};

exports.Mongoz = (requestBody) => {

    var update = { $set: {} }

    _.keys(requestBody).forEach((property) => {

        if (_.isObject(requestBody[property]) && property == "evento") {

            update["$push"] = {}

            _.set(update, "$push.eventi", requestBody[property])

            // _.keys(requestBody[property]).forEach((subproperty) => { 

            // })
        } else {
            _.set(update, "$set." + property, requestBody[property])
        }
    })

    //console.log(update);

    return update
}



exports.mongoz2 = (schema, requestBody) => {

    console.log(_.keys(schema));

    var update = { $set: {} }

    function root() {
        _.keys(requestBody).forEach((property) => {

        })
    }
}