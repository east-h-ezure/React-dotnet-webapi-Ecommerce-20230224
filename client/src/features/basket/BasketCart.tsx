import React, { useState, useEffect } from 'react';
import { useStoreContext } from '../../app/context/StoreContext';
import { BasketItem } from '../../app/models/basket';
import { useAppDispatch } from '../../app/store/configureStore.1';
interface Props {
  baskets: BasketItem[];
  basket: BasketItem;
}

const BasketCart = ({ basket, baskets }: Props) => {
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  //Reduxテスト
  // const { setBasket } = useStoreContext();
  const [basketId, setBasketId] = useState(1);

  useEffect(() => {
    fetch(`https://localhost:5000/api/basket?basketId=${basketId}`, {
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
      <div>BasketItem</div>
      {basketItems.map((item) => (
        <div key={item.productId}>{item.quantity}</div>
      ))}
      {/* <div>Basket</div>
      {basket.product.map((i) => (
      <div>
        {i.name}
      </div>
        ))} */}
    </div>
  );
};

export default BasketCart;
