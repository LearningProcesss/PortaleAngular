/**
 * $regex su DocumentArray non sembra funzionare così come per i campi di primo livello
 */

const { ObjectID } = require("mongodb")
const _ = require("lodash")
var d = require('debug')("app:routeToMongoMiddleware")
// var { mongoose } = require("../db/db")


var defaultActionsParser = {
  q: function (requestQueryString, options) { }
}

var defaultDataTypeConverters = {
  string: function (str) { return str; },
  int: function (str) { var i = parseInt(str); return isNaN(i) ? undefined : i },
  float: function (str) { var i = parseFloat(str); return isNaN(i) ? undefined : i },
  date: function (str) { var d = new Date(str); return isNaN(d.getTime()) ? undefined : d },
  bool: function (str) {
    // no, false, 0 => false. Others, (including '', eg, for checkboxes) is considered true.
    return !/^n|^f/i.test(str) || str == '0';
  },
  objectid: function (str) { return new ObjectID(str) },
  array: function (str) { return str }
}

function regEscape(pattern) {
  if (pattern !== undefined) {
    return pattern.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
  }
}

module.exports = function (options) {
  return function (req, res, next) {
    d("request", req.method)
    d("query", req.query.q)
    d("projection", req.query.f)

    var querySelector = {
      $match: {}
    }

    if (req.method == "GET" && !_.isNil(req.query.q)) {

      parseQueryString(req.query.q, options.routeTicket.model.schema)
        .map(p => p.operator)
        .forEach(parameterOperatorObject => {
          d("main func", parameterOperatorObject)
          querySelector.$match[Object.keys(parameterOperatorObject)[0]] = parameterOperatorObject[Object.keys(parameterOperatorObject)[0]]
        })

      d("main func result query selector", querySelector.$match)

      req.mongoroute = { filter: querySelector }
    }

    next()
  }
}

function parseQueryString(query, schema) {

  var parameters = []

  _.split(query, ",")
    .map(paramPlusValue => {
      if (!_.isNil(paramPlusValue)) {
        return paramPlusValue
      }
    })
    .forEach(paramPlusValue => {

      var parameter = parseSingleUrlQueryParam(paramPlusValue.split(/(<|=|>|!|\$|\^)/g), paramPlusValue.split(/\b(?:[<>]=?|=|\$|\^)\b/g), schema)

      parameters.push(parameter)
    })
  return parameters
}

function parseSingleUrlQueryParam(options, options2, schema) {

  d("parseSingleUrlQueryParam", options, options2)

  /*
  modelPathField:      campo primo livello del model | es: eventi
  modelPathFieldQuery: campo completo per la query   | es: eventi.testo
  value:               valore
  tipo:                0 $match primo livello        | es: $match: { titolo: { $eq: "Primo ticket" } }
                       1 per $lookup                 | es: $lookup: { from: "portalUsers", localField: "_cliente", foreignField: "_id", as: "users" }
  */
  var ret = {
    modelPathField: '',
    modelPathFieldQuery: options2[0],
    value: options2[1],
    operator: {},
    tipo: 0
  }

  //eventi.testo=secondo evento eventi è un sub document non una collection esterna
  //_cliente.nome è una collection in join
  if (options[0].indexOf(".") > 0) {
    ret.modelPathField = options[0].split(".")[0]
  } else {
    ret.modelPathField = options[0]
  }

  const modelSchemaType = schema.path(ret.modelPathField)

  d("parseSingleUrlQueryParam params construction model type mongo", modelSchemaType)

  if (modelSchemaType.options.ref != undefined) {
    ret.tipo = 1
  } else {
    ret.tipo = 0
  }



  var operators = _.difference(options, options2)

  d("parseSingleUrlQueryParam operators diff", operators)

  if (operators[0] == "=" && operators.length == 1) {
    ret.operator = { [ret.modelPathFieldQuery]: { $eq: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](ret.value) } }
  } else if (operators[0] == ">" && operators.length == 1) {
    ret.operator = { [ret.modelPathFieldQuery]: { $gt: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](ret.value) } }
  } else if (operators[0] == "<" && operators.length == 1) {
    ret.operator = { [ret.modelPathFieldQuery]: { $lt: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](ret.value) } }
  } else if (operators[0] == "<" && operators.length == 3 && operators[2] == "=") {
    ret.operator = { [ret.modelPathFieldQuery]: { $lte: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](ret.value) } }
  } else if (operators[0] == ">" && operators.length == 3 && operators[2] == "=") {
    ret.operator = { [ret.modelPathFieldQuery]: { $gte: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](ret.value) } }
  } else if (operators[0] == "$" && operators.length == 1) {
    ret.operator = { [ret.modelPathFieldQuery]: { $regex: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](ret.value), $options: "$i" } }
  } else if (operators[0] == "^" && operators.length == 1) {
    ret.operator = { [ret.modelPathFieldQuery]: { $regex: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](ret.value), $options: "^i" } }
  }

  return ret
}


