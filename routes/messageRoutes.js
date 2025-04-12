const express = require('express');
const router = express.Router();
const { getTelegramMessages } = require('../controllers/telegramController');

// GET /api/messages/telegram
router.get('/telegram', getTelegramMessages);

module.exports = router;
