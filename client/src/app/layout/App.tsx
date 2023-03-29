import { Product } from '../models/product';
import Catalog from '../../features/catalog/Catalog';
import Header from './Header';
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Header2 from './Header2';
// import { getCookie } from './app/util/util';
// import agent from './app/api/agent';
import Loading from './Loading';
import { BasketItem } from '../models/basket';
import { useAppDispatch } from '../store/configureStore.1';
import { Outlet } from 'react-router-dom';
import { setBasket } from '../../features/basket/basketSlice';
import axios from 'axios';

const App = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  // const [basketId, setBasketId] = useState<string>(
  //   'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21'
  // );
  const [basketId, setBasketId] = useState<number>(1);
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
    },
  });
  // const [product, setProduct] = useState<Product[]>([]);

  // useEffect(() => {
  //   const fetchBasketItems = async () => {
  //     const response = await axios.get(
  //       `https://localhost:5000/api/Basket?basketId=${basketId}`
  //     );
  //     // setBasketItems(response.data);
  //     dispatch(setBasket(response.data));
  //     setLoading(false);
  //     console.log('setBasket', setBasket);
  //   };
  //   fetchBasketItems();
  // }, [dispatch]);

  useEffect(() => {
    const fetchBasketItems = async () => {
      const response = await fetch(
        `https://localhost:5000/api/Basket?basketId=${basketId}`,
        {
          mode: 'cors',
        }
      );
      const data = await response.json();
      dispatch(setBasket(data));
      setLoading(false);
      console.log('setBasket', setBasket);
    };
    fetchBasketItems();
  }, [dispatch]);
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const response = await fetch(`https://localhost:5000/api/Product`, {
  //       mode: 'cors',
  //     });
  //     const data = await response.json();
  //     setProduct(data);
  //     setLoading(false);
  //     console.log('product', product);
  //   };
  //   fetchProducts();
  // });

  // const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  // const [basket, setBasket] = useState<BasketConfirm | null>(null);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };
  // ステップ1
  let totalItemCount = 0;

  // // ステップ2
  // basketItems.forEach((item) => {
  //   totalItemCount += item.quantity;
  // });
  // console.log(totalItemCount);

  return (
    <ThemeProvider theme={theme}>
      {/* <ToastContainer position="bottom-right" hideProgressBar theme="colored" /> */}
      <CssBaseline />
      {<Header2 darkMode={darkMode} handleThemeChange={handleThemeChange} />}
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
};

export default App;
