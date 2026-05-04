import React from 'react';
import { Grid } from '@mui/material';
import Chatbot from './Chatbot.jsx';

export default function ChatPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Chatbot />
      </Grid>
    </Grid>
  );
}