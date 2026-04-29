// src/components/ScrubModal.jsx
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Stack
} from '@mui/material';

const ScrubModal = ({ open, handleClose, onSubmit }) => {
  const [percentage, setPercentage] = useState(8);
  const [older, setOlder] = useState(10);

  useEffect(() => {
    if (!open) {
      setPercentage(8);
      setOlder(10);
    }
  }, [open]);

  const handleSubmit = async () => {
    await onSubmit({
      percentage: Number(percentage),
      older: Number(older)
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Scrub Options</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <div>
            <Typography sx={{ mb: 1 }}>Percentage</Typography>
            <TextField
              fullWidth
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            />
          </div>

          <div>
            <Typography sx={{ mb: 1 }}>Older</Typography>
            <TextField
              fullWidth
              type="number"
              value={older}
              onChange={(e) => setOlder(e.target.value)}
            />
          </div>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Run
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScrubModal;