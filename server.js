const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Вставь свой API ключ здесь (начинается на AIza...)
const GEMINI_API_KEY = "AIzaSyAN2ISegomczju1EUiwq9hzGAOWkJgfcds";

// Настройка Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Настраиваем модель (flash — самая быстрая и дешевая)
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "Ты полезный ассистент." // Твоя системная роль
});

app.use(cors());
app.use(express.json());

// Проверка работы сервера
app.get("/", (req, res) => {
  res.send("Gemini AI Server is running");
});

// ЧАТ-эндпоинт
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Нет сообщения" });
    }

    // Запрос к нейросети
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // Отправляем ответ фронтенду
    res.json({
      reply: text || "Пустой ответ от Gemini"
    });

  } catch (error) {
    console.error("GEMINI ERROR:", error);

    // Если ключ неверный или ошибка сервера
    res.json({
      reply: "Ошибка Gemini: проверьте ключ или соединение"
    });
  }
});

// Порт для запуска (для Render или локально)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
