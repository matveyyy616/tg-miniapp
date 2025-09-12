import TelegramBot from 'node-telegram-bot-api';

// === Настройки ===
const token = '8316920165:AAHL2YvXYr2TuftvVpfEnGkBQgCrdvkgAUc'; // вставь сюда свой токен
const webAppUrl = 'https://matveyyy616.github.io/tg-miniapp/'; // ссылка на твой тест

// === Инициализация бота ===
const bot = new TelegramBot(token, { polling: true });

// === Команда /start ===
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Выберите тест:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Открыть тесты', web_app: { url: webAppUrl } }]
      ]
    }
  });
});

// === Приём данных из WebApp ===
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
