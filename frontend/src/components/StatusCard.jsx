import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box
} from '@mui/material';
import api from '../api/snapraid';

function StatusCard() {
  const [loading, setLoading] = useState(false);
  const [outputOpen, setOutputOpen] = useState(false);
  const [outputTitle, setOutputTitle] = useState('');
  const [outputText, setOutputText] = useState('');
  const [errorText, setErrorText] = useState('');

  const showOutput = (title, text) => {
    setOutputTitle(title);
    setOutputText(text || '');
    setErrorText('');
    setOutputOpen(true);
  };

  const handleAction = async (type) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/functions/${type}`);
      const text =
        data?.output ||
        data?.stdout ||
        (typeof data === 'string' ? data : JSON.stringify(data, null, 2));

      showOutput(type.charAt(0).toUpperCase() + type.slice(1), text);
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        'Request failed';

      setOutputTitle(type.charAt(0).toUpperCase() + type.slice(1));
      setOutputText('');
      setErrorText(message);
      setOutputOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          minHeight: 240,
          borderRadius: 1,
          backgroundColor: 'darkslategray',
          border: '1px solid #1e8678',
          boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
        }}
      >
        <CardContent>
          <Typography variant="h4" sx={{ color: 'white' }}>
            Other
          </Typography>

          <Stack spacing={1} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              onClick={() => handleAction('status')}
              disabled={loading}
              sx={{ backgroundColor: 'rgba(255,255,255,0.5)', color: 'black' }}
            >
              Status
            </Button>

            <Button
              variant="contained"
              onClick={() => handleAction('smart')}
              disabled={loading}
              sx={{ backgroundColor: 'rgba(255,255,255,0.5)', color: 'black' }}
            >
              Smart
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={outputOpen}
        onClose={() => setOutputOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{outputTitle} Output</DialogTitle>
        <DialogContent dividers>
          {errorText ? (
            <Box sx={{ color: 'error.main', whiteSpace: 'pre-wrap' }}>
              {errorText}
            </Box>
          ) : (
            <TextField
              multiline
              fullWidth
              minRows={16}
              value={outputText}
              InputProps={{
                readOnly: true,
                sx: {
                  fontFamily: 'monospace',
                  fontSize: 14
                }
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOutputOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default StatusCard;