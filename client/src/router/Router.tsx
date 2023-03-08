import Contact from '../features/contact/Contact';
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import Header2 from '../app/layout/Header2';
import HomePage from '../features/home/HomePage';
import AboutPage from '../features/about/AboutPage';
// import Header from '../app/layout/Header';
import ProductDetails from '../features/catalog/ProductDetails';

const Router = () => {
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
      <Container maxWidth={false}>
        <BrowserRouter>
          {/* <Header darkMode={darkMode} handleThemeChange={handleThemeChange} /> */}
          <Header2 darkMode={darkMode} handleThemeChange={handleThemeChange} />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/catalog/:id" element={<ProductDetails />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
};

export default Router;
