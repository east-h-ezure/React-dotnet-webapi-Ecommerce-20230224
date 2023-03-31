import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { BasketItem } from '../models/basket';
// import { toast } from 'react-toastify';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/',
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

const requests = {
  get: (url: string) => instance.get(url).then(responseBody),
  post: (url: string, body: {}) => instance.post(url, body).then(responseBody),
  put: (url: string, body: {}) => instance.put(url, body).then(responseBody),
  del: (url: string) => instance.delete(url).then(responseBody),
};

// const requests = {
//   get: (url: string) => axios.get(url).then(responseBody),
//   post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
//   put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
//   del: (url: string) => axios.delete(url).then(responseBody),
// };

const Catalog = {
  list: () => requests.get('products'),
  details: (id: number) => requests.get(`products/${id}`),
  fetchFilters: () => requests.get('products/filters'),
};

const TestErrors = {
  get400Error: () => requests.get('buggy/bad-request'),
  get401Error: () => requests.get('buggy/unauthorised'),
  get404Error: () => requests.get('buggy/not-found'),
  get500Error: () => requests.get('buggy/server-error'),
  getValidationError: () => requests.get('buggy/validation-error'),
};
// eslint-disable-next-line react-hooks/rules-of-hooks
// const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
// eslint-disable-next-line react-hooks/rules-of-hooks
// const [basketId, setBasketId] = useState<string>(
//   'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21'
// );
// eslint-disable-next-line react-hooks/rules-of-hooks
// const [basketId, setBasketId] = useState<number>(1);

const Basket = {
  get: (basketId: number) => requests.get(`Basket?basketId=${basketId}`),
  // basketItems: (basketId: string) =>
  //   requests
  //     .get(`Basket?basketId=${basketId}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setBasket(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       throw error;
  //     }),
  addItem: (productId: number, quantity = 1, buyerId: string) =>
    requests.post(
      `basket?productId=${productId}&quantity=${quantity}&buyerId=${buyerId}`,
      {}
    ),
  removeItem: (productId: number, quantity = 1, buyerId: string) =>
    requests.del(
      `basket?productId=${productId}&quantity=${quantity}&buyerId=${buyerId}`
    ),
};

const agent = {
  Catalog,
  TestErrors,
  Basket,
};

export default agent;
