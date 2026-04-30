const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 👉 ВСТАВЬ СЮДА СВОЙ API КЛЮЧ
const API_KEY = "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";

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Нет ответа";

    res.json({ reply });

  } catch (e) {
    res.json({ reply: "Ошибка сервера 😢" });
  }
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});