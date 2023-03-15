import Contact from '../features/contact/Contact';
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import Header2 from '../app/layout/Header2';
import HomePage from '../features/home/HomePage';
import ProductDetails from '../features/catalog/ProductDetails';
import { Product } from '../product';
import { Basket, BasketConfirm } from '../app/models/basket';
import AppBasket from '../AppBasket';

const Router = () => {
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
    },
  });

  // const [baskets, setBaskets] = useState<BasketConfirm[]>([]);
  // const [basket, setBasket] = useState<BasketConfirm | null>(null);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false}>
        <BrowserRouter>
          <Header2 darkMode={darkMode} handleThemeChange={handleThemeChange} />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/catalog/:id" element={<ProductDetails />} />
            <Route path="/home" element={<HomePage />} />
            {/* {basket !== null && (
              <Route
                path="/basket"
                element={<AppBasket baskets={baskets} basket={basket} />}
              />
            )} */}
            {/* <Route
              path="/basket"
              element={<AppBasket baskets={baskets} basket={basket} />}
            /> */}
            {/* {basket && (
              <Route path="/basket" element={<AppBasket basket={basket} />} />
            )} */}
            <Route path="/basket" element={<AppBasket />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
};

export default Router;
