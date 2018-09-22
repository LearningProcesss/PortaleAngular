var { ObjectID } = require("mongodb")
const { PortalUser } = require("../models/portaluser")
const _ = require("lodash")
const parserz = require('../lib/parserz')
const PagedResult = require("../viewmodel/pagedresult")
var d = require('debug')("app:portalUserController")

exports.users = async(req, resp) => {

    var pagedResult = new PagedResult(1, 1)

    pagedResult.setcollection = await PortalUser.aggregate(req.mongoroute.aggregatorResult)

    resp.json(pagedResult)
}