
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai"); // Используем актуальный SDK [3]

const app = express();
app.use(cors());
app.use(express.json());

// --- КОНФИГУРАЦИЯ ---
// Вставьте ваш ключ здесь. Рекомендуется использовать process.env.GEMINI_API_KEY на Render
const API_KEY = "AIzaSyA5Txxbl72YkO6DlkphzRsAeoPLDEy1GMw"; 

const ai = new GoogleGenAI({ apiKey: API_KEY });

app.get("/", (req, res) => {
  res.send("Server is running! Gemini 2.5 Flash is active.");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Сообщение пустое" });
    }

    // В 2026 году используем стабильную модель 2.5 Flash [1, 4]
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: message }] }]
    });

    // В новом SDK текст ответа доступен напрямую через свойство.text [3, 5]
    res.json({ reply: result.text });

  } catch (error) {
    console.error("LOG:", error);
    res.status(500).json({ 
      reply: "Ошибка сервера Gemini", 
      details: error.message 
    });
  }
});

const PORT = process.env.PORT |

| 10000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
