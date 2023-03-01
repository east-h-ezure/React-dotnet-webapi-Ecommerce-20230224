import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import Header2 from '../../app/layout/Header2';

const HomePage = () => {
  return (
    // <ThemeProvider theme={theme}>
    //   <CssBaseline />
    //   <Header2 darkMode={darkMode} handleThemeChange={handleThemeChange} />
    //   {/* <Header2 /> */}
    //   <Container>
    <div>
      <Typography>ホーム</Typography>
    </div>
    //   </Container>
    // </ThemeProvider>
  );
};

export default HomePage;
