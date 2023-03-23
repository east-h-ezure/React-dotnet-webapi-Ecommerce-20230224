import { Product } from '../../product';
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
import { BasketConfirm } from '../models/basket';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [basketId, setBasketId] = useState<string>(
    'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21'
  );
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
    },
  });

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

  return (
    <div>
      <Catalog />
    </div>
  );
};

export default App;
