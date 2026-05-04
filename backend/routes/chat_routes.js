import { Router } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const ollamaLocation = process.env.OLLAMA;

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { messages, model = 'qwen3.5:9b', system = 'You are a helpful assistant.' } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages must be an array' });
    }

    const response = await fetch(ollamaLocation, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        system,
        messages,
        stream: false,
        keep_alive: '10m'
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: 'Ollama request failed',
        details: text
      });
    }

    const data = await response.json();

    return res.json({
      reply: data?.message?.content || '',
      raw: data
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Chat request failed',
      details: error?.message || String(error)
    });
  }
});

export default router;