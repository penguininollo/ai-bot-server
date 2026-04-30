const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// --- КОНФИГУРАЦИЯ ---
// 1. Убедись, что ключ новый. 
// 2. Вставляй его аккуратно между кавычек.
const GEMINI_API_KEY = "AIzaSyAN2ISegomczju1EUiwq9hzGAOWkJgfcds"; 

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Проверка работы сервера (открой https://твой-адрес.onrender.com/ в браузере)
app.get("/", (req, res) => {
  res.send("Gemini Server is Online (Ohio Region)");
});

// Основной роут
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Нет сообщения" });

    // Попробуем получить модель максимально простым способом
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const text = result.response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("LOG:", error);
    
    // Если всё равно 404, попробуем дать подсказку
    let hint = error.message.includes("404") 
      ? "Google не видит модель. Попробуй в коде заменить 'gemini-1.5-flash' на 'gemini-pro'" 
      : error.message;

    res.json({ reply: "Ошибка: " + hint });
  }
});

// Порт 10000 стандартный для Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
