const express = require('express');
const cntrl = require("../controllers/schemasController");
const portalUsersMiddleware = require("../middlewares/portalUsersMiddleware")

const router = express.Router()

router.get("/:tipo", portalUsersMiddleware, cntrl.schemaDefinition)

router.get("/:tipo/:path", portalUsersMiddleware, cntrl.schemaPathDefinition)

router.get("/:tipo/:path/:property", portalUsersMiddleware, cntrl.schemaPathDefinitionProperty)

module.exports = router