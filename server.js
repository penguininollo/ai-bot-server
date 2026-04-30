const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// ВСТАВЬ СЮДА СВОЙ КЛЮЧ
const API_KEY = "AIzaSyA5Txxbl72YkO6DlkphzRsAeoPLDEy1GMw"; 

const genAI = new GoogleGenerativeAI(API_KEY);

app.get("/", (req, res) => res.send("Server is running!"));

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    // Используем gemini-1.5-flash — она сейчас основная
    // Важно: вызываем БЕЗ дополнительных настроек внутри
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("DETAILED ERROR:", error);
    res.json({ reply: "Ошибка: " + error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
