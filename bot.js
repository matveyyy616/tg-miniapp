import TelegramBot from 'node-telegram-bot-api';
import express from 'express';

const token = process.env.BOT_TOKEN; // токен из BotFather
const bot = new TelegramBot(token, { polling: false }); // polling отключен

const app = express();
app.use(express.json());

// Устанавливаем webhook
const url = process.env.RENDER_EXTERNAL_URL; // например: https://tg-miniapp.onrender.com
bot.setWebHook(`${url}/bot${token}`);

// Приём апдейтов от Telegram
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Команда /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Привет! Я бот ПК‑клуба 🚀');
});

// Пример реакции на слово "тест"
bot.on('message', (msg) => {
  if (msg.text && msg.text.toLowerCase().includes('тест')) {
    bot.sendMessage(msg.chat.id, 'Запускаем тест...');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
