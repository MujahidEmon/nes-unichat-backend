const express = require('express');
const cors = require('cors');
require('dotenv').config();
const messageRoutes = require('./routes/messageRoutes');
const client = require('./db'); // ✅ FROM db.js
const { fetchTelegramMessages } = require('./controllers/telegramController'); // ✅ Now it's safe

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use('/api/messages', messageRoutes);

async function run() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected");
    
    await fetchTelegramMessages(); // ✅ Now safe to call
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}
run();

app.get('/', (req, res) => {
  res.send('nES server is running');
});

app.listen(port, () => {
  console.log('nes server is running on port', port);
});
