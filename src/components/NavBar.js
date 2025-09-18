import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Knowledge Hub
        </Typography>
        <Stack direction="row" spacing={1}>
          {token && (
            <>
              <Button color="inherit" component={Link} to="/">Dashboard</Button>
              <Button color="inherit" component={Link} to="/docs/new">New Doc</Button>
              <Button color="inherit" component={Link} to="/search">Search</Button>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          )}
          {!token && (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
