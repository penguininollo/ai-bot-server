const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// --- КОНФИГУРАЦИЯ ---
// Рекомендуется использовать process.env.API_KEY на Render, но для быстрой проверки вставь ключ здесь
const API_KEY = "AIzaSyA5Txxbl72YkO6DlkphzRsAeoPLDEy1GMw"; 

const genAI = new GoogleGenerativeAI(API_KEY);

// Тестовый роут
app.get("/", (req, res) => {
  res.send("Сервер Gemini запущен и готов к работе!");
});

// ГЛАВНЫЙ РОУТ ЧАТА
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Сообщение пустое" });
    }

    // Инициализируем модель БЕЗ явного указания apiVersion (библиотека сама выберет актуальную)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Запрос к нейронке
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // Отправляем ответ обратно на фронтенд
    res.json({ reply: text });

  } catch (error) {
    console.error("ОШИБКА GEMINI API:", error);
    
    // Если ошибка связана с ключом или моделью, выводим подробности
    res.status(500).json({ 
      reply: "Произошла ошибка при обращении к нейросети.", 
      details: error.message 
    });
  }
});

// Порт для Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
