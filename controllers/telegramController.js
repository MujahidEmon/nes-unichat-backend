const axios = require('axios');
const client = require('../db'); // ✅ Now it pulls MongoDB from db.js

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

async function fetchTelegramMessages() {
  try {
    console.log("🔍 Fetching messages from:", `${TELEGRAM_API}/getUpdates`);

    const res = await axios.get(`${TELEGRAM_API}/getUpdates`);
    const updates = res.data.result;

    console.log("📝 Telegram API response:", updates);

    const db = client.db('nes');
    const collection = db.collection('telegramMessages');

    for (const update of updates) {
      const message = update.message;
      if (message && message.text) {
        const exists = await collection.findOne({ message_id: message.message_id });
        if (!exists) {
          await collection.insertOne({
            message_id: message.message_id,
            user: message.from.first_name,
            text: message.text,
            date: new Date(message.date * 1000),
          });
        }
      }
    }

    console.log("✅ Telegram messages fetched and saved");
  } catch (err) {
    console.error("❌ Error fetching Telegram messages:", err.message);
  }
}



async function getTelegramMessages(req, res) {
  try {
    const db = client.db('nes');
    const collection = db.collection('telegramMessages');
    const messages = await collection.find().sort({ date: -1 }).toArray();
    res.json(messages);
  } catch (err) {
    console.error("❌ Failed to get Telegram messages:", err.message);
    res.status(500).json({ error: 'Failed to get Telegram messages' });
  }
}

module.exports = {
  fetchTelegramMessages,
  getTelegramMessages,
};
