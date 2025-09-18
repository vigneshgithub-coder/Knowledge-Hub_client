import React, { useState } from 'react';
import { Paper, Stack, TextField, Button, Typography, Divider } from '@mui/material';
import api from '../api';

export default function Search() {
  const [q, setQ] = useState('');
  const [textResults, setTextResults] = useState([]);
  const [semanticResults, setSemanticResults] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const doText = async () => {
    const { data } = await api.get('/api/search/text', { params: { q } });
    setTextResults(data || []);
  };

  const doSemantic = async () => {
    const { data } = await api.get('/api/search/semantic', { params: { q } });
    setSemanticResults(data || []);
  };

  const ask = async () => {
    const { data } = await api.post('/api/ai/qa', { question });
    setAnswer(data.answer || '');
  };

  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <TextField fullWidth label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
          <Button variant="contained" onClick={doText}>Text Search</Button>
          <Button variant="outlined" onClick={doSemantic}>Semantic</Button>
        </Stack>
      </Paper>

      {!!textResults.length && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Text Results</Typography>
          {textResults.map((d) => (
            <Typography key={d._id} variant="body2" sx={{ mb: 1 }}>
              <strong>{d.title}</strong> — {d.summary || d.content?.slice(0, 120)}
            </Typography>
          ))}
        </Paper>
      )}

      {!!semanticResults.length && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Semantic Results</Typography>
          {semanticResults.map((d) => (
            <Typography key={d._id} variant="body2" sx={{ mb: 1 }}>
              <strong>{d.title}</strong> — score {(d._score || 0).toFixed(3)} — {d.summary || d.content?.slice(0, 120)}
            </Typography>
          ))}
        </Paper>
      )}

      <Divider sx={{ my: 2 }} />

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Team Q&A</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <TextField fullWidth label="Ask a question" value={question} onChange={(e) => setQuestion(e.target.value)} />
          <Button variant="contained" onClick={ask}>Ask</Button>
        </Stack>
        {answer && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Typography whiteSpace="pre-wrap">{answer}</Typography>
          </Paper>
        )}
      </Paper>
    </>
  );
}
