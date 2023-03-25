import { createBrowserRouter, Navigate } from 'react-router-dom';
import AboutPage from '../../features/about/AboutPage';
import AppBasket from '../../AppBasket';
import Catalog from '../../features/catalog/Catalog';
import ProductDetails from '../../features/catalog/ProductDetails';
import Checkout from '../../features/checkout/Checkout';
import Contact from '../../features/contact/Contact';
import HomePage from '../../features/home/HomePage';
// import NotFound from '../errors/NotFound';
// import ServerError from "../errors/ServerError";
import App from '../layout/App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/home', element: <HomePage /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'catalog/:id', element: <ProductDetails /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <Contact /> },
      //   { path: 'server-error', element: <ServerError /> },
      //   { path: 'not-found', element: <NotFound /> },
      { path: 'basket', element: <AppBasket /> },
      { path: 'checkout', element: <Checkout /> },
      { path: '*', element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
