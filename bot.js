import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

// Настройки
const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL;

// Инициализация бота
const bot = new TelegramBot(token, { polling: true });

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Выберите тест:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Открыть тесты', web_app: { url: webAppUrl } }]
      ]
    }
  });
});

// Приём данных из WebApp
bot.on('message', (msg) => {
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg.web_app_data.data);
      bot.sendMessage(
        msg.chat.id,
        `🏁 Тест завершён!\nРезультат: ${data.score} из ${data.total}`
      );
    } catch (err) {
      console.error('Ошибка парсинга данных:', err);
    }
  }
});

// Мини‑сервер для Render
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is running'));
app.listen(port, () => console.log(`Server listening on port ${port}`));
