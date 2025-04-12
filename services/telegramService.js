const axios = require('axios');
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
let lastUpdateId = 0;

const getTelegramMessages = async () => {
  const res = await axios.get(`${TELEGRAM_API}/getUpdates`, {
    params: {
      offset: lastUpdateId + 1,
      timeout: 5,
    },
  });

  const newMessages = [];

  for (let update of res.data.result) {
    lastUpdateId = update.update_id;
    const msg = update.message;
    if (msg?.text) {
      newMessages.push({
        sender: msg.from.first_name,
        text: msg.text,
        chatId: msg.chat.id.toString(),
        platform: 'telegram',
        timestamp: new Date()
      });
    }
  }

  return newMessages;
};

module.exports = { getTelegramMessages };
