const express = require('express');
// const middleWareUser = require("../middleware/user-checker");
const usersCntrl = require("../controllers/portalUserController");

const router = express.Router()

router.post("/signup", usersCntrl.signup)

router.post("/signin", usersCntrl.signin)

router.get("", usersCntrl.users)

module.exports = router