import React from 'react';
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 200,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 200,
          backgroundColor: 'darkslategray',
          color: 'white'
        }
      }}
    >
      <List>
        <ListItemButton onClick={() => navigate('/')}>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate('/settings')}>
          <ListItemText primary="Schedules" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate('/chat')}>
          <ListItemText primary="Chatbot" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default SideBar;