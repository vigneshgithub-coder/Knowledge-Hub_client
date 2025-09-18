import React, { useState } from 'react';
import { TextField, Button, Paper, Stack, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 420, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
          <Typography variant="body2">No account? <Button component={Link} to="/register">Register</Button></Typography>
        </Stack>
      </form>
    </Paper>
  );
}
