import React, { useEffect, useState, useMemo } from 'react';
import { Grid, Paper, Typography, TextField, Button, Stack, Chip, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DocumentCard from '../components/DocumentCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [feed, setFeed] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch (_) {
      return null;
    }
  }, []);

  // Get all unique tags from documents
  const allTags = useMemo(() => {
    const tags = new Set();
    docs.forEach(doc => {
      (doc.tags || []).forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [docs]);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.q = filter;
      if (selectedTags.length > 0) params.tags = selectedTags.join(',');
      
      const [d1, d2] = await Promise.all([
        api.get('/api/documents', { params }),
        api.get('/api/documents/activity'),
      ]);
      setDocs(d1.data || []);
      setFeed(d2.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [selectedTags]); // Reload when selectedTags changes

  const onOpen = (doc) => navigate(`/docs/${doc._id}`);

  const onSummarize = async (doc) => {
    await api.post(`/api/documents/${doc._id}/summarize`);
    load();
  };
  const onTags = async (doc) => {
    await api.post(`/api/documents/${doc._id}/tags`);
    load();
  };

  const handleTagClick = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setFilter('');
    setSelectedTags([]);
  };

  const onEdit = (doc) => navigate(`/docs/${doc._id}`);

  const onDelete = async (doc) => {
    if (!window.confirm('Delete this document?')) return;
    await api.delete(`/api/documents/${doc._id}`);
    load();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <TextField 
                size="small" 
                label="Search documents" 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && load()}
                fullWidth
              />
              <Button variant="contained" onClick={load} disabled={loading}>Search</Button>
              <Button variant="outlined" onClick={() => navigate('/docs/new')}>New Document</Button>
            </Stack>
            
            {(selectedTags.length > 0 || allTags.length > 0) && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>Filter by tags:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {allTags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => handleTagClick(tag)}
                      color={selectedTags.includes(tag) ? 'primary' : 'default'}
                      variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                      size="small"
                    />
                  ))}
                  {selectedTags.length > 0 && (
                    <Button size="small" onClick={clearFilters} sx={{ ml: 1 }}>
                      Clear filters
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Stack>
        </Paper>
        {docs.map((doc) => (
          <DocumentCard
            key={doc._id}
            doc={doc}
            currentUser={currentUser}
            onOpen={onOpen}
            onSummarize={onSummarize}
            onTags={onTags}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {!docs.length && <Typography>No documents yet.</Typography>}
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Team Activity Feed</Typography>
          {(feed || []).map((a) => (
            <Typography key={a._id} variant="body2" sx={{ mb: 1 }}>
              <strong>{a.user?.name || 'Someone'}</strong> {a.action} <em>{a.document?.title || 'a document'}</em> — {new Date(a.createdAt).toLocaleString()}
            </Typography>
          ))}
          {!feed.length && <Typography variant="body2">No recent activity.</Typography>}
        </Paper>
      </Grid>
    </Grid>
  );
}
