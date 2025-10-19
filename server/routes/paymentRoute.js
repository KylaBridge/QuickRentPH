const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/requireAuth');
const { createPayment, getPayments } = require('../controllers/paymentController');

router.post('/', requireAuth, createPayment);
router.get('/', requireAuth, getPayments);

module.exports = router;
