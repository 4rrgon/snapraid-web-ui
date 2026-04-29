import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  Chip,
  Divider,
  Box
} from '@mui/material';
import api from '../api/snapraid';
import TaskModal from './TaskModal.jsx';

const STORAGE_KEY = 'snapraid-schedules';

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
  },
  lastRunAt: null,
  lastOutput: '',
  lastError: ''
};

const normalizeForm = (value) => ({
  ...emptyForm,
  ...value,
  args: {
    ...emptyForm.args,
    ...(value?.args || {})
  }
});

const loadLocalTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveLocalTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const runTask = async (task) => {
  switch (task.action) {
    case 'sync':
      return api.get(`/functions/sync/${Boolean(task.args.prehash)}`);
    case 'scrub':
      return api.get(`/functions/scrub/${Number(task.args.percentage)}/${Number(task.args.older)}`);
    case 'status':
      return api.get('/functions/status');
    case 'check':
      return api.get('/functions/check');
    case 'smart':
      return api.get('/functions/smart');
    default:
      throw new Error(`Unknown action: ${task.action}`);
  }
};

function Settings() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setTasks(loadLocalTasks());
  }, []);

  const persistTasks = (nextTasks) => {
    setTasks(nextTasks);
    saveLocalTasks(nextTasks);
  };

  const handleCreate = () => {
    setEditingTask(emptyForm);
    setOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(normalizeForm(task));
    setOpen(true);
  };

  const handleSave = async (form) => {
    const normalized = normalizeForm(form);

    const savedTask = {
      ...normalized,
      id: normalized.id ?? (globalThis.crypto?.randomUUID?.() || String(Date.now())),
      args: {
        ...normalized.args,
        percentage: Number(normalized.args.percentage),
        older: Number(normalized.args.older)
      }
    };

    const nextTasks = form.id
      ? tasks.map((task) => (task.id === form.id ? savedTask : task))
      : [savedTask, ...tasks];

    persistTasks(nextTasks);
    setMessage('Schedule saved locally.');
  };

  const updateTask = (id, patch) => {
    const nextTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...patch } : task
    );
    persistTasks(nextTasks);
  };

  const handleDelete = (id) => {
    persistTasks(tasks.filter((task) => task.id !== id));
  };

  const handlePause = (id) => {
    updateTask(id, { enabled: false });
  };

  const handleResume = (id) => {
    updateTask(id, { enabled: true });
  };

  const handleRun = async (task) => {
    try {
      setMessage('');
      const { data } = await runTask(task);

      updateTask(task.id, {
        lastRunAt: new Date().toLocaleString(),
        lastOutput: data?.output || JSON.stringify(data, null, 2),
        lastError: ''
      });

      setMessage(`${task.name} ran successfully.`);
    } catch (err) {
      const errorText =
        err?.response?.data?.error ||
        err?.message ||
        'Run failed';

      updateTask(task.id, {
        lastRunAt: new Date().toLocaleString(),
        lastError: errorText
      });

      setMessage(errorText);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Card sx={{ backgroundColor: 'darkslategray', color: 'white' }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h4">Scheduled Tasks</Typography>
              <Button variant="contained" onClick={handleCreate}>
                New Task
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          {tasks.length === 0 && (
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: 'darkslategray', color: 'white' }}>
                <CardContent>
                  <Typography>No schedules yet.</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {tasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <Card
                sx={{
                  backgroundColor: 'darkslategray',
                  color: 'white',
                  height: '100%'
                }}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">{task.name}</Typography>
                    <Chip
                      label={task.enabled ? 'Enabled' : 'Paused'}
                      color={task.enabled ? 'success' : 'default'}
                      size="small"
                    />
                  </Stack>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Action: {task.action}
                  </Typography>
                  <Typography variant="body2">Cron: {task.cronExpression}</Typography>
                  <Typography variant="body2">Last Run: {task.lastRunAt || 'never'}</Typography>
                  <Typography variant="body2">
                    Last Error: {task.lastError || 'none'}
                  </Typography>

                  {task.lastOutput ? (
                    <>
                      <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                      <Typography variant="caption" sx={{ display: 'block', whiteSpace: 'pre-wrap' }}>
                        {task.lastOutput}
                      </Typography>
                    </>
                  ) : null}

                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

                  <Stack spacing={1}>
                    <Button variant="contained" onClick={() => handleRun(task)}>
                      Run Now
                    </Button>
                    <Button variant="contained" onClick={() => handleEdit(task)}>
                      Edit
                    </Button>
                    {task.enabled ? (
                      <Button variant="contained" onClick={() => handlePause(task.id)}>
                        Pause
                      </Button>
                    ) : (
                      <Button variant="contained" onClick={() => handleResume(task.id)}>
                        Resume
                      </Button>
                    )}
                    <Button variant="outlined" color="error" onClick={() => handleDelete(task.id)}>
                      Delete
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>

      <TaskModal
        open={open}
        handleClose={() => {
          setOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
        initialValue={editingTask}
      />
    </Box>
  );
}

export default Settings;