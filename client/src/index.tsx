import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Router from './router/Router';
import { store, useAppDispatch } from './app/store/configureStore.1';
import { StoreProvider } from './app/context/StoreContext';
import { Provider } from 'react-redux';
import Contact from './features/contact/Contact';
import { setBasketItem } from './features/basket/basketSlice';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes';

// const store = configureStore();
// console.log('getState', store.getState());

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <>
    {/* <StoreProvider> */}
    <Provider store={store}>
      {/* <Contact /> */}
      {/* <Router /> */}
      <RouterProvider router={router} />
    </Provider>
    {/* </StoreProvider> */}
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
function useEffect(arg0: () => void, arg1: any[]) {
  throw new Error('Function not implemented.');
}
