import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  FormControlLabel,
  Checkbox
} from '@mui/material';

const emptyForm = {
  id: null,
  name: '',
  cronExpression: '',
  action: 'sync',
  enabled: true,
  args: {
    prehash: false,
    percentage: 8,
    older: 10
  }
};

const normalizeForm = (value) => ({
  ...emptyForm,
  ...value,
  args: {
    ...emptyForm.args,
    ...(value?.args || {})
  }
});

function TaskModal({ open, handleClose, onSave, initialValue }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      setForm(normalizeForm(initialValue));
    }
  }, [open, initialValue]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const updateArgs = (field, value) => {
    setForm((prev) => ({
      ...prev,
      args: {
        ...prev.args,
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      await onSave({
        ...form,
        args: {
          ...form.args,
          percentage: Number(form.args.percentage),
          older: Number(form.args.older)
        }
      });
      handleClose();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const onClose = () => {
    setForm(emptyForm);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{form.id ? 'Edit Task' : 'Create Task'}</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            fullWidth
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
          />

          <TextField
            label="Cron Expression"
            fullWidth
            value={form.cronExpression}
            onChange={(e) => updateField('cronExpression', e.target.value)}
            helperText="Example: 0 3 * * *"
          />

          <TextField
            select
            label="Action"
            fullWidth
            value={form.action}
            onChange={(e) => updateField('action', e.target.value)}
          >
            <MenuItem value="sync">sync</MenuItem>
            <MenuItem value="scrub">scrub</MenuItem>
            <MenuItem value="status">status</MenuItem>
            <MenuItem value="check">check</MenuItem>
            <MenuItem value="smart">smart</MenuItem>
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.enabled}
                onChange={(e) => updateField('enabled', e.target.checked)}
              />
            }
            label="Enabled"
          />

          {form.action === 'sync' && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!form.args.prehash}
                  onChange={(e) => updateArgs('prehash', e.target.checked)}
                />
              }
              label="Pre-hash"
            />
          )}

          {form.action === 'scrub' && (
            <Stack spacing={2}>
              <TextField
                label="Percentage"
                type="number"
                fullWidth
                value={form.args.percentage}
                onChange={(e) => updateArgs('percentage', e.target.value)}
              />
              <TextField
                label="Older"
                type="number"
                fullWidth
                value={form.args.older}
                onChange={(e) => updateArgs('older', e.target.value)}
              />
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskModal;