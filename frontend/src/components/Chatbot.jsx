import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
  CircularProgress
} from '@mui/material';
import api from '../api/snapraid';

export default function Chatbot() {
  const systemPrompt = useMemo(() => ({
    role: 'system',
    content: 'You are a helpful assistant for a SnapRAID dashboard. Be concise, accurate, and practical.'
  }), []);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi. Ask me anything about the dashboard, SnapRAID actions, or schedules.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', content: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/chat', {
        messages: nextMessages,
        model: 'qwen3.5:9b',
        system: systemPrompt.content
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || '(no response)' }
      ]);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Chat failed');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card sx={{ backgroundColor: 'darkslategray', color: 'white', height: '100%' }}>
      <CardContent>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Chatbot
        </Typography>

        <Box
          sx={{
            height: 420,
            overflowY: 'auto',
            p: 2,
            mb: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(0,0,0,0.15)'
          }}
        >
          <Stack spacing={2}>
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: msg.role === 'user'
                    ? 'rgba(255,255,255,0.22)'
                    : 'rgba(255,255,255,0.10)'
                }}
              >
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {msg.role}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </Typography>
              </Box>
            ))}

            {loading && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={18} />
                <Typography variant="body2">Thinking...</Typography>
              </Stack>
            )}
          </Stack>
        </Box>

        <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

        <Stack spacing={1}>
          <TextField
            multiline
            minRows={3}
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            InputProps={{ style: { color: 'white' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' }
              }
            }}
          />

          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            Send
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}