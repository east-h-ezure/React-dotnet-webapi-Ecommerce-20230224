import './App.css';
import { Product } from './product';
import Catalog from './features/catalog/Catalog';
import Header from './app/layout/Header';
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Header2 from './app/layout/Header2';
// import { getCookie } from './app/util/util';
// import agent from './app/api/agent';
// import Loading from './app/layout/Loading';

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

  return (
    <div>
      <Catalog />
    </div>
  );
};

export default App;
