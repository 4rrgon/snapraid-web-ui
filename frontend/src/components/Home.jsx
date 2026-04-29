import React from 'react';
import { Grid } from '@mui/material';
import SyncCard from './Sync.jsx';
import ScrubCard from './Scrub.jsx';
import StatusCard from './StatusCard.jsx';

function Home() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <SyncCard />
      </Grid>
      <Grid item xs={12} md={4}>
        <ScrubCard />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatusCard />
      </Grid>
    </Grid>
  );
}

export default Home;