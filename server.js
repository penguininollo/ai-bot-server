const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// --- КОНФИГУРАЦИЯ ---
// Вставь сюда свежий ключ из Google AI Studio
const API_KEY = "AIzaSyA5Txxbl72YkO6DlkphzRsAeoPLDEy1GMw"; 

const genAI = new GoogleGenerativeAI(API_KEY);

// Тестовый роут, чтобы проверить, жив ли сервер
app.get("/", (req, res) => {
  res.send("Server is running on Ohio region!");
});

// ГЛАВНЫЙ РОУТ ЧАТА
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Сообщение пустое" });
    }

    // Инициализируем модель с явным указанием версии v1
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { apiVersion: 'v1' }
    );

    // Запрос к нейронке
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // Отправляем ответ обратно на фронтенд
    res.json({ reply: text });

  } catch (error) {
    console.error("FULL LOG:", error);
    
    // Выводим ошибку, чтобы понять, если что-то не так
    res.status(500).json({ 
      reply: "Ошибка сервера Gemini", 
      details: error.message 
    });
  }
});

// Порт для Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
