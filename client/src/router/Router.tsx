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
import { getCookie } from '../app/util/util';
// import agent from '../app/api/agent';
// import { useStoreContext } from '../app/context/StoreContext';
import Loading from '../app/layout/Loading';

const Router = () => {
  // const { setBasket } = useStoreContext();
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
    },
  });
  // useEffect(() => {
  //   const userId = getCookie('userId');
  //   if (userId) {
  //     agent.Basket.get()
  //       .then((basket) => setBasket(basket))
  //       .catch((error) => console.log(error))
  //       .finally(() => setLoading(false));
  //   }
  // }, [setBasket]);

  const [basketItems, setBasketItems] = useState<BasketConfirm[]>([]);
  // const [basket, setBasket] = useState<BasketConfirm | null>(null);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };
  // ステップ1
  let totalItemCount = 0;

  // ステップ2
  basketItems.forEach((item) => {
    totalItemCount += item.quantity;
  });
  console.log(totalItemCount);
  // if (loading) return <Loading message="initialising app" />;

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
            <Route path="/basket" element={<AppBasket />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
};

export default Router;
