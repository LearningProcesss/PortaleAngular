const express = require('express');
const ticketsCntrl = require("../controllers/ticketsController");
const portalUsersMiddleware = require("../middlewares/portalUsersMiddleware")
const filesMiddleware = require('../middlewares/filesMiddleware')

const router = express.Router()

router.get("/:id", portalUsersMiddleware, ticketsCntrl.getTicket)

router.get("", portalUsersMiddleware, ticketsCntrl.getTickets)

router.post("", portalUsersMiddleware, filesMiddleware, ticketsCntrl.saveTicket)

router.post("/:id", portalUsersMiddleware, ticketsCntrl.saveEventTicket)

router.delete("/:id", portalUsersMiddleware, ticketsCntrl.deleteTicketById)

router.put("/:id", portalUsersMiddleware, ticketsCntrl.updateTicket)

router.put("/:id/:idEvento", portalUsersMiddleware, ticketsCntrl.saveFileEvent)

module.exports = router;