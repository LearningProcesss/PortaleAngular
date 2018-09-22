const express = require('express');
// const middleWareUser = require("../middleware/user-checker");
const usersCntrl = require("../controllers/authUserController");

const router = express.Router()

router.post("/signup", usersCntrl.signup)

router.post("/signin", usersCntrl.signin)

module.exports = router