import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BasketConfirm } from './app/models/basket';

function AppBasket() {
  const [basketItems, setBasketItems] = useState<BasketConfirm[]>([]);
  const [basketId, setBasketId] = useState<string>(
    'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21'
  );

  useEffect(() => {
    const fetchBasketItems = async () => {
      const response = await axios.get(
        `https://localhost:5000/api/BasketItem?basketId=${basketId}`
      );
      setBasketItems(response.data);
    };
    fetchBasketItems();
  }, [basketId]);

  console.log(basketItems);

  return (
    <ul>
      {basketItems.map((item) => (
        <li key={item.basketId}>
          {item.product.name}: {item.quantity}
          {item.product.brand}
        </li>
      ))}
    </ul>
  );
}

export default AppBasket;
