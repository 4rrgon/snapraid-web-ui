import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
      <Card sx={{ width: 420, backgroundColor: 'darkslategray', color: 'white' }}>
        <CardContent>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                variant="outlined"
                autoComplete="email"
                InputLabelProps={{ style: { color: 'white' } }}
                sx={{
                  input: { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  }
                }}
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                variant="outlined"
                autoComplete="current-password"
                InputLabelProps={{ style: { color: 'white' } }}
                sx={{
                  input: { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  }
                }}
              />

              {error && <Alert severity="error">{error}</Alert>}

              <Button type="submit" variant="contained">
                Sign In
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;