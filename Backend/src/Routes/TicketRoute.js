const express = require('express');
const router = express.Router();
const TicketController = require('../Controller/TicketController');

router.get('/', TicketController.listTickets);
router.post('/', TicketController.createTicket);
router.put('/:id/status', TicketController.updateStatus);

module.exports = router;
