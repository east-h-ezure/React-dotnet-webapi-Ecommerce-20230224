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
import { useStoreContext } from './app/context/StoreContext';
// import { getCookie } from './app/util/util';
import agent from './app/api/agent';
import Loading from './app/layout/Loading';

const App = () => {
  const { setBasket } = useStoreContext();
  const [loading, setLoading] = useState(true);
  const [basketId, setBasketId] = useState<string>(
    'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21'
  );
  // useEffect(() => {
  //   const userId = getCookie('userId');
  //   if (userId) {
  //     agent.Basket.get()
  //       .then((basket) => setBasket(basket))
  //       .catch((error) => console.log(error))
  //       .finally(() => setLoading(false));
  //   }
  // }, [setBasket]);
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
  // if (loading) return <Loading />;
  return (
    // <ThemeProvider theme={theme}>
    //   <CssBaseline />
    //   <Header2 darkMode={darkMode} handleThemeChange={handleThemeChange} />
    //   <Container>
    <div>
      <Catalog />
    </div>
    // </Container>
    // </ThemeProvider>
  );
};

export default App;
