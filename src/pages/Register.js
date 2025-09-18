import React, { useState } from 'react';
import { TextField, Button, Paper, Stack, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password, role });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 420, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>Register</Typography>
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
          <Typography variant="body2">Have an account? <Button component={Link} to="/login">Login</Button></Typography>
        </Stack>
      </form>
    </Paper>
  );
}
