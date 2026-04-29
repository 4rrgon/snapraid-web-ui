// src/components/ScrubCard.jsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Stack } from '@mui/material';
import ScrubModal from './ScrubModal.jsx';
import api from '../api/snapraid';

function ScrubCard() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRun = async ({ percentage, older }) => {
    setLoading(true);
    try {
      await api.get(`/functions/scrub/${percentage}/${older}`);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
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
          Scrub
        </Typography>

        <Stack spacing={1} sx={{ mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              color: 'black',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.7)' }
            }}
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            Run Scrub
          </Button>
        </Stack>
      </CardContent>

      <ScrubModal
        open={open}
        handleClose={() => setOpen(false)}
        onSubmit={handleRun}
      />
    </Card>
  );
}

export default ScrubCard;