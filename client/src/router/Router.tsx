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
    <>
      <BrowserRouter>
        {/* <App /> */}
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/contact" element={<Contact />} />
          {/* {/* <Route path="/catalog" element={<About />} /> */}
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
