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
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
    },
  });

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header2 darkMode={darkMode} handleThemeChange={handleThemeChange} />
      {/* <Header2 /> */}
      <Container>
        <Typography>ホーム</Typography>
      </Container>
    </ThemeProvider>
  );
};

export default HomePage;
