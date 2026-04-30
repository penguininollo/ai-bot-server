const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

// ❗ ВСТАВЛЕН КЛЮЧ НАПРЯМУЮ (НЕ ДЛЯ ПРОДАКШЕНА)
const client = new OpenAI({
  apiKey: "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"
});

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Ты полезный ассистент" },
        { role: "user", content: message }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ reply: "error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
