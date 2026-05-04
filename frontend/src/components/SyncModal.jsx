import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel
} from '@mui/material';

const SyncModal = ({ open, handleClose, onSubmit }) => {
  const [preHash, setPreHash] = useState(false);

  useEffect(() => {
    if (!open) setPreHash(false);
  }, [open]);

  const handleSubmit = async () => {
    await onSubmit(preHash);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Sync Settings</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={preHash}
              onChange={(e) => setPreHash(e.target.checked)}
            />
          }
          label="Pre-hash"
        />
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

export default SyncModal;