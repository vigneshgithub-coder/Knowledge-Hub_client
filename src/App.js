import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddEditDoc from './pages/AddEditDoc';
import Search from './pages/Search';

const theme = createTheme();

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavBar />
        <Box sx={{ py: 3 }}>
          <Container maxWidth="lg">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/docs/new" element={<RequireAuth><AddEditDoc mode="create" /></RequireAuth>} />
              <Route path="/docs/:id" element={<RequireAuth><AddEditDoc mode="edit" /></RequireAuth>} />
              <Route path="/search" element={<RequireAuth><Search /></RequireAuth>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
