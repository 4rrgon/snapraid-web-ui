import React from 'react';
import { Box } from '@mui/material';
import TopBar from './TopBar';
import SideBar from './SideBar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SideBar />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar />

        <Box sx={{ padding: 2, flexGrow: 1, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;