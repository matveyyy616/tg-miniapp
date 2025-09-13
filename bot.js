import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: false });

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

// Команда /start с кнопкой для мини‑аппы
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Привет! Вот твоя мини‑аппа 🚀', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Открыть мини‑приложение',
            web_app: { url: process.env.WEBAPP_URL }
          }
        ]
      ]
    }
  });
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
