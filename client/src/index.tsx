import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Router from './router/Router';
import { configureStore } from './app/store/configureStore.1';
import { StoreProvider } from './app/context/StoreContext';
import { Provider } from 'react-redux';
import Contact from './features/contact/Contact';

const store = configureStore();
console.log('getState', store.getState());

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <>
    {/* <StoreProvider> */}
    <Provider store={store}>
      {/* <Contact /> */}
      <Router />
    </Provider>
    {/* </StoreProvider> */}
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
