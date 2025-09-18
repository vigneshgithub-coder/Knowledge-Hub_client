import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Stack, TextField, Button, Typography, Chip } from '@mui/material';
import api from '../api';

export default function AddEditDoc({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const isEdit = mode === 'edit';

  useEffect(() => {
    const load = async () => {
      if (isEdit && id) {
        try {
          const { data } = await api.get(`/api/documents/${id}`);
          setTitle(data.title || '');
          setContent(data.content || '');
          setTags(data.tags || []);
        } catch (error) {
          console.error('Error loading document:', error);
          // Optionally show an error message to the user
        }
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/api/documents/${id}`, { title, content, tags });
      } else {
        await api.post('/api/documents', { title, content, tags });
      }
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto', mt: 3 }}>
      <Typography variant="h6" gutterBottom>{isEdit ? 'Edit Document' : 'Create Document'}</Typography>
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <TextField label="Content" value={content} onChange={(e) => setContent(e.target.value)} multiline minRows={8} required />
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField label="Add tag" size="small" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
            <Button variant="outlined" onClick={addTag}>Add</Button>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {tags.map((t) => <Chip key={t} label={t} onDelete={() => removeTag(t)} />)}
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            <Button variant="text" onClick={() => navigate(-1)}>Cancel</Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
}
