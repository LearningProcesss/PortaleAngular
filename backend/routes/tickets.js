const express = require('express');
const ticketsCntrl = require("../controllers/ticketsController");
const portalUsersMiddleware = require("../middlewares/portalUsersMiddleware")

const router = express.Router()

router.get("/:id", portalUsersMiddleware, ticketsCntrl.getTicket)

router.get("", portalUsersMiddleware, ticketsCntrl.getTickets)

router.post("", portalUsersMiddleware, ticketsCntrl.saveTicket)

router.delete("/:id", portalUsersMiddleware, ticketsCntrl.deleteTicketById)

router.put("/:id", portalUsersMiddleware, ticketsCntrl.updateTicket)

module.exports = router;