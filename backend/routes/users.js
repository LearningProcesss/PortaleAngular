const express = require('express');
const portalUsersMiddleware = require("../middlewares/portalUsersMiddleware")
const usersCntrl = require("../controllers/usersController");

const router = express.Router()

router.get("", portalUsersMiddleware, usersCntrl.users)

module.exports = router