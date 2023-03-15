import React, { useState, useEffect } from 'react';
import { BasketConfirm } from '../../app/models/basket';
interface Props {
  baskets: BasketConfirm[];
  basket: BasketConfirm;
}

const BasketCart = ({ basket, baskets }: Props) => {
  const [basketItems, setBasketItems] = useState<BasketConfirm[]>([]);

  useEffect(() => {
    fetch(`https://localhost:5000/api/basketitem?basketId=${basket.basketId}`, {
      mode: 'cors',
    })
      .then((response) => response.json())
      .then((data) => setBasketItems(data))
      .catch((error) => console.error(error));
  }, [basket]);

  if (basketItems.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {basketItems.map((item) => (
        <div key={item.basketId}>{item.quantity}</div>
      ))}
    </div>
  );
};

export default BasketCart;
