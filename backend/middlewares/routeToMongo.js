/**
 * $regex su DocumentArray non sembra funzionare così come per i campi di primo livello
 */

const { ObjectID } = require("mongodb")
const _ = require("lodash")
const d = require('debug')("app:routeToMongoMiddleware")
const url = require("url")


const defaultActionsParser = {
  /**
   * @param {string} requestQueryString 
   * @param {any} schema 
   * @param {any} aggregateBuilder 
   */
  q: function (requestQueryString, aggregateBuilder, queryOperator) {

    aggregateBuilder.push(buildMatchPipelineStage(null, queryOperator))

    divide(requestQueryString).map(singleRawPrm => parseSingleUrlQueryParam(singleRawPrm.split(regDividePrm.options), singleRawPrm.split(regDividePrm.options2), aggregateBuilder))
  },
  p: function (requestProjectionString, aggregateBuilder) {
    if (!_.isNil(requestProjectionString)) {

      aggregateBuilder.push({ $project: {} })

      divide(requestProjectionString).map(singleRawPrm => parseSingleUrlProjectionParam(singleRawPrm.split(regDividePrm.options), singleRawPrm.split(regDividePrm.options2), aggregateBuilder))
    }
  }
}

const defaultDataTypeConverters = {
  string: function (str) { return str; },
  int: function (str) { var i = parseInt(str); return isNaN(i) ? undefined : i },
  float: function (str) { var i = parseFloat(str); return isNaN(i) ? undefined : i },
  date: function (str) { var d = new Date(str); return isNaN(d.getTime()) ? undefined : d },
  bool: function (str) {
    // no, false, 0 => false. Others, (including '', eg, for checkboxes) is considered true.
    return !/^n|^f/i.test(str) || str == '0';
  },
  number: function (str) { var i = parseFloat(str); return isNaN(i) ? undefined : i },
  objectid: function (str) { return new ObjectID(str) },
  array: function (str) { return str }
}

const regDividePrm = {
  options: /(<|=|>|!|\$|\^|~|\?)/g,
  options2: /\b(?:[<>]=?|=|\$|\^|~|\?)\b/g
}

let holder = {
  db: {},
  schema: {}
}

module.exports = function (options) {

  return function (req, res, next) {
    d("MAIN request", req.method)
    d("MAIN query", req.query.q)
    d("MAIN projection", req.query.p)
    d("MAIN equality match operator", req.query.eo)

    let parsed = url.parse(req.url)

    console.log("parsed", parsed);

    if (parsed.pathname === options.routeUser.routeUrl) {
      holder.db = options.routeUser.db
      holder.schema = options.routeUser.model.schema
    } else {
      holder.db = options.routeTicket.db
      holder.schema = options.routeTicket.model.schema
    }

    // d("MAIN", holder.schema)

    var aggregator = []

    if (req.method == "GET") {

      defaultActionsParser.q(!_.isNil(req.query.q) && req.query.q !== "" ? req.query.q : "_id??", aggregator, req.query.eo)

      defaultActionsParser.p(req.query.p, aggregator)

      d("MAIN result", aggregator)

      req.mongoroute = { aggregatorResult: aggregator }
    }

    next()
  }
}

/**
 * Divide la query string q sono eliminati i vuoti-undefined
 * @param {string} query 
 */
function divide(query) {
  return _.split(query, ",")
    .map(paramPlusValue => {
      if (!_.isNil(paramPlusValue)) {
        return paramPlusValue
      }
    })
}

/**
 * 
 * @param {string[]} options 
 * @param {string[]} options2 
 * @param {any} schema 
 */
function parseSingleUrlQueryParam(options, options2, aggregateBuilder) {

  d("parseSingleUrlQueryParam", options, options2)

  //     _cliente                  |     nome
  // Schema: Ticket Tipo: ObjectID   Schema: modelSchemaType.options.ref Tipo:   
  let modelPathSuborJoin = options[0].indexOf(".") > 0 ? options[0].split(".") : [options[0]]
  let modelPathField = options[0]
  let modelPathFieldType = holder.schema.path(modelPathField)
  let valore = options2[1]
  let operators = _.difference(options, options2)

  // Object.assign(m, { ciao: "a" })

  // d("m", m)

  // d("parseSingleUrlQueryParamp modelPathFields", modelPathFields)
  // modelPathFields.map((schemaProperty, i) => {
  //   d("parseSingleUrlQueryParamp path", holder.schema.path(schemaProperty))
  //   if (i == 0) {
  //     if (holder.schema.path(schemaProperty).options.ref != undefined) {
  //       dictionary.push({ key: schemaProperty, value: holder.schema.path(schemaProperty) })
  //     } else {
  //       dictionary.push({ key: options[0], value: holder.schema.path(schemaProperty) })
  //     }
  //   } else if (i > 0 && dictionary[i - 1].value.options.ref != undefined) {
  //     dictionary.push({ key: schemaProperty, value: holder.db.model(dictionary[i - 1].value.options.ref).schema.path(schemaProperty) })
  //   }
  // })

  // d("parseSingleUrlQueryParam dictionary", dictionary)

  /**  // var modelPathField = options[0].indexOf(".") > 0 ? options[0].split(".")[0] : options[0]
  // var modelPathFieldQuery = options2[0]
   * TODO:
   * - Creare una uncorrelated subquery non filtra sul primo livello.
   * ESEMPIO:
   * _cliente.nome=Carlo restituisce tutti i Ticket ma con sotto "esploso" _cliente con le informazioni dell'utente trovato dal $match dentro la pipeline del $lookup
   * Risoluzione:
   * - creare una comune JOIN tra una collezione ed un'altra, dal front end la query sarà sempre composta così: ?q=_cliente=5b5f79c6a8cd03201edb7f8c
   * ESEMPIO:
   * { $lookup: collezioneesterna: portalusers, chiaveInterna: _cliente, chiaveesterna: _id, as: usr }, { $unwind: usr }
   * TODO:
   * - rendere valida una query sui subdocuments array e non.
   * ESEMPIO:
   * eventi.creatoDa=Mattia Minerva
   */
  // if (modelPathFields.length == 2 && dictionary.filter(schema => schema.value.options.ref != undefined).length == 1) {

  //   let lookup = buildLookupPipelineStage(dictionary[0].value.options.ref.toString().toLowerCase() + "s", dictionary[0].key, '_id', dictionary[0].key, true)

  //   d("parseSingleUrlQueryParam $lookup", lookup)

  //   lookup.$lookup.pipeline.push(buildMatchPipelineStage(buildMatchOperator(operators, dictionary[1].key, dictionary[1].value, valore)))

  //   d("parseSingleUrlQueryParam $lookup pipeline", lookup.$lookup.pipeline[0])

  //   let unwind = buildUnwindPipelineStage(dictionary[0].key)

  //   d("parseSingleUrlQueryParam $unwind", unwind)

  //   aggregateBuilder.push(lookup)

  //   d("parseSingleUrlQueryParam aggregateBuilder", aggregateBuilder)
  // } else {
  //   aggregateBuilder.push(buildMatchPipelineStage(buildMatchOperator(operators, dictionary[0].key, dictionary[0].value, valore)))
  // }

  updateMatchPipeline(aggregateBuilder, buildMatchOperator(operators, modelPathField, modelPathFieldType, valore))

  modelPathField = null
  modelPathFieldType = null
  valore = null
  operators = null
}

function parseSingleUrlProjectionParam(options, options2, aggregateBuilder) {

  d("parseSingleUrlProjectionParam", options, options2)

  // let modelPathSuborJoin = options[0].indexOf(".") > 0 ? options[0].split(".") : [options[0]]
  let modelPathField = options[0]
  // let modelPathFieldType = holder.schema.path(modelPathField)
  // let valore = options2[1]
  // let operators = _.difference(options, options2)

  updateProjectPipeline(aggregateBuilder, modelPathField.toString().trim())
}

/**
 * 
 * @param {string} fromCollection 
 * @param {string} localFieldCollection 
 * @param {string} foreignFieldCollection 
 * @param {string} asCollection 
 * @param {boolean} initPipeline crea pipeline: []
 */
function buildLookupPipelineStage(fromCollection, localFieldCollection, foreignFieldCollection, asCollection, initPipeline) {

  let l = {
    $lookup: {
      from: fromCollection,
      as: asCollection,
      localField: localFieldCollection,
      foreignField: foreignFieldCollection
    }
  }

  if (_.isBoolean(initPipeline)) {
    l.$lookup.pipeline = []
  }

  return l
}

function buildMatchPipelineStage(matchOperator, queryOperator) {

  var m = {
    $match: {

    }
  }

  if (queryOperator === "and" || queryOperator === undefined || queryOperator === null) {
    // m.$match["$and"] = [{}]
    Object.assign(m.$match, { $and: [] })
  } else {
    // m.$match.$or = []
    Object.assign(m.$match, { $or: [] })
  }

  if (matchOperator !== undefined && matchOperator !== null) {
    m.$match[Object.keys(matchOperator)[0]] = matchOperator[Object.keys(matchOperator)[0]]
  }

  return m
}

function buildUnwindPipelineStage(modelPathField) {
  var u = {
    $unwind: { path: '$' + modelPathField }
  }
  // var u = {
  //   $unwind: '$_cliente'
  // }

  return u
}

function buildProjectPipelineStage() {
  return { $project: {} }
}

/**
 * 
 * @param {string[]} operators 
 * @param {string} modelPathFieldQuery 
 * @param {any} modelSchemaType 
 * @param {string} value 
 */
function buildMatchOperator(operators, modelPathFieldQuery, modelSchemaType, value) {

  d("buildMatchOperator", modelPathFieldQuery, modelSchemaType)

  if (operators[0] == "=" && operators.length == 1) {
    return { [modelPathFieldQuery]: { $eq: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](value) } }
  } else if (operators[0] == ">" && operators.length == 1) {
    return { [modelPathFieldQuery]: { $gt: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](value) } }
  } else if (operators[0] == "<" && operators.length == 1) {
    return { [modelPathFieldQuery]: { $lt: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](value) } }
  } else if (operators[0] == "<" && operators.length == 3 && operators[2] == "=") {
    return { [modelPathFieldQuery]: { $lte: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](value) } }
  } else if (operators[0] == "!" && operators.length == 3 && operators[2] == "=") {
    return { [modelPathFieldQuery]: { $ne: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](value) } }
  } else if (operators[0] == ">" && operators.length == 3 && operators[2] == "=") {
    return { [modelPathFieldQuery]: { $gte: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](value) } }
  } else if (operators[0] == "$" && operators.length == 1) {
    return { [modelPathFieldQuery]: { $regex: new RegExp(defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](value) + "$"), $options: "i" } }
  } else if (operators[0] == "^" && operators.length == 1) {
    return { [modelPathFieldQuery]: { $regex: new RegExp("^" + defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](value)), $options: "i" } }//start ?
  } else if (operators[0] == "~" && operators.length == 1) {
    return { [modelPathFieldQuery]: { $regex: new RegExp(defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](value)), $options: "i" } }//contains ?
  } else if (operators[1] == "?" && operators[3] == "?") {
    return { [modelPathFieldQuery]: { $exists: true } }
  } else if (operators[1] == "!" && operators[3] == "!") {
    return { [modelPathFieldQuery]: { $exists: false } }
  } else if (operators[1] == "?" && operators[3] == ">") {
    if (modelSchemaType["instance"].toLowerCase() == "string") {
      return { [modelPathFieldQuery]: { $in: [...operators[4].split(":").map(v => new RegExp(v, "i"))] } }
    } else if (modelSchemaType["instance"].toLowerCase() == "number") {
      return { [modelPathFieldQuery]: { $in: [...operators[4].split(":").map(v => defaultDataTypeConverters(modelSchemaType["instance"].toLowerCase())(v))] } }
    }
  } else if (operators[1] == "!" && operators[3] == ">") {
    return { [modelPathFieldQuery]: { $nin: [...operators[4].split(":").map(v => new RegExp(v, "i"))] } }
  } else if (operators[1] == "<" && operators[3] == ">") {
    return { [modelPathFieldQuery]: { $gte: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](operators[4].split(":")[0]), $lt: defaultDataTypeConverters[modelSchemaType["instance"].toLowerCase()](operators[4].split(":")[1]) } }
  } else if (operators[1] == ">" && operators[3] == ">") {
    //TODO SLICE
  }

}

function updateMatchPipeline(aggregateBuilder, matchOperator) {

  if (aggregateBuilder[aggregateBuilder.findIndex(stage => stage["$match"] !== undefined)].$match.$and !== undefined) {
    d("AND")
    aggregateBuilder[aggregateBuilder.findIndex(stage => stage["$match"] !== undefined)].$match.$and.push(matchOperator)

  } else if (aggregateBuilder[aggregateBuilder.findIndex(stage => stage["$match"] !== undefined)].$match.$or !== undefined) {
    d("OR")
    aggregateBuilder[aggregateBuilder.findIndex(stage => stage["$match"] !== undefined)].$match.$or.push(matchOperator)

  }
}

function updateProjectPipeline(aggregateBuilder, field) {

  let fieldc = {}

  fieldc[field] = 1

  d("updateProjectPipeline", fieldc)

  Object.assign(aggregateBuilder[aggregateBuilder.findIndex(stage => stage["$project"] !== undefined)].$project, fieldc)
}
