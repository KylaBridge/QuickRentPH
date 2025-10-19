const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/requireAuth');
const { createPayment, getPayments, getOwnerEarnings } = require('../controllers/paymentController');


router.post('/', requireAuth, createPayment);
router.get('/', requireAuth, getPayments);
router.get('/owner', requireAuth, getOwnerEarnings);

module.exports = router;
