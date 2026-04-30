const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// --- НАСТРОЙКИ ---
// Вставь сюда свой ключ (начинается на AIza...)
const GEMINI_API_KEY = "AIzaSyAN2ISegomczju1EUiwq9hzGAOWkJgfcds"; 

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "Ты полезный ассистент." 
});

app.use(cors());
app.use(express.json());

// Проверка связи
app.get("/", (req, res) => {
  res.send("Gemini Server is Online");
});

// Основной чат
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Сообщение пустое" });
    }

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({
      reply: text || "Нейросеть прислала пустой ответ"
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.json({
      reply: "Ошибка на стороне сервера Gemini. Проверьте API ключ."
    });
  }
});

// Порт для Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
