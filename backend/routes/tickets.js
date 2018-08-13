const express = require('express');
// const middleWareUser = require("../middleware/user-checker");
// const middlewareFile = require("../middleware/fileMiddleware");
const ticketsCntrl = require("../controllers/ticketsController");
const portalUsersMiddleware = require("../middlewares/portalUsersMiddleware")

const router = express.Router()

router.get("/:id", portalUsersMiddleware, ticketsCntrl.getTicket)

router.get("", portalUsersMiddleware, ticketsCntrl.getTickets)

router.post("", portalUsersMiddleware, ticketsCntrl.saveTicket)

router.delete("/:id", portalUsersMiddleware, ticketsCntrl.deleteTicketById)

router.put("/:id", portalUsersMiddleware, ticketsCntrl.updateTicket)

// router.get("/:id", postCntrl.getPostById);

// router.post("", middleWareUser, middlewareFile, postCntrl.createPost);

// router.put('/:id', middleWareUser, middlewareFile, postCntrl.updatePostById);

// router.delete("/:id", middleWareUser, postCntrl.deletePostById);

module.exports = router;