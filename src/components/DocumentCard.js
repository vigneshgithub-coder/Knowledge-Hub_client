import React from 'react';
import { Card, CardContent, CardActions, Typography, Chip, Stack, Button } from '@mui/material';

export default function DocumentCard({ doc, currentUser, onSummarize, onTags, onOpen, onEdit, onDelete }) {
  const userId = currentUser?.id;
  const userRole = currentUser?.role;
  const createdById = doc?.createdBy?._id || doc?.createdBy?.id; // populated has _id
  const canModify = userRole === 'admin' || (userId && createdById && String(userId) === String(createdById));

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{doc.title}</Typography>
        {doc.summary && <Typography variant="body2" sx={{ mb: 1.5 }}>{doc.summary}</Typography>}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {(doc.tags || []).map((t) => <Chip key={t} label={t} size="small" />)}
        </Stack>
        {doc.createdBy && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            By {doc.createdBy.name || 'Unknown'}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onOpen?.(doc)}>Open</Button>
        {canModify && (
          <>
            <Button size="small" onClick={() => onSummarize?.(doc)}>Summarize with Gemini</Button>
            <Button size="small" onClick={() => onTags?.(doc)}>Generate Tags with Gemini</Button>
            <Button size="small" onClick={() => onEdit?.(doc)}>Edit</Button>
            <Button size="small" color="error" onClick={() => onDelete?.(doc)}>Delete</Button>
          </>
        )}
      </CardActions>
    </Card>
  );
}
