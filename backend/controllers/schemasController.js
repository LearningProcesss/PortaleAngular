var { ObjectID } = require("mongodb")
const { PortalUser } = require("../models/portaluser")
const { Ticket } = require("../models/ticket")
const _ = require("lodash")
const parserz = require('../lib/parserz')
const PagedResult = require("../viewmodel/pagedresult")
var d = require('debug')("app:schemaController")

exports.schemaDefinition = async (req, resp) => {
    let schemaPath = {}

    if (req.params.tipo === "ticket") {
        schemaPath[req.params.tipo] = Ticket.schema
    } else if (req.params.tipo === "user") {
        schemaPath = PortalUser.schema.path(req.params.path)
    }

    resp.json(schemaPath)
}

exports.schemaPathDefinition = async (req, resp) => {

    let schemaPath = {}

    if (req.params.tipo === "ticket") {
        schemaPath[req.params.path] = Ticket.schema.path(req.params.path)
    } else if (req.params.tipo === "user") {
        schemaPath = PortalUser.schema.path(req.params.path)
    }

    resp.json(schemaPath)
}

exports.schemaPathDefinitionProperty = async (req, resp) => {

    let schemaPath = {}

    if (req.params.tipo === "ticket") {
        schemaPath[req.params.property] = Ticket.schema.path(req.params.path)[req.params.property]
    } else if (req.params.tipo === "user") {
        schemaPath = PortalUser.schema.path(req.params.path)[req.params.property]
    }

    resp.json(schemaPath)
}