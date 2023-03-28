import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Basket } from '../models/basket';

interface StoreContextValue {
  // removeItem: (productId: number, quantity: number, userId: string) => void;
  setBasket: (basket: Basket[]) => void;
  basket: Basket[];
}

export const StoreContext = createContext<StoreContextValue | undefined>(
  undefined
);

export function useStoreContext() {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw Error('Oops - we do not seem to be inside the provider');
  }

  return context;
}

export function StoreProvider({ children }: PropsWithChildren<any>) {
  const [basket, setBasket] = useState<Basket[]>([]);

  /* function removeItem(productId: number, quantity: number, userId: string) {
    if (!basket) return;
    const items = [...basket]; // new array of items
    const itemIndex = items.findIndex((i) =>
      i.items.map((item) => item.productId === productId)
    );
    if (itemIndex >= 0) {
      // items[itemIndex].items.quantity -= quantity;
      items[0].items[itemIndex].quantity
      if (items[itemIndex].items.quantity === 0) items.splice(itemIndex, 1);
      setBasket((prevState: Basket[]) => {
        return [...items];
      });
    }
  } */
  // function removeItem(productId: number, quantity: number, userId: string) {
  //   if (!basket) return;
  //   const items = [...basket]; // new array of items
  //   const itemIndex = items.findIndex((i) => i.items.map((i) => i.productId) === productId);
  //   if (itemIndex >= 0) {
  //     items[itemIndex].items = items[itemIndex].items.map((item) => {
  //       if (item.productId === productId) {
  //         return {
  //           ...item,
  //           quantity: item.quantity - quantity
  //         };
  //       }
  //       return item;
  //     }).filter((item) => item.quantity > 0);
  //     setBasket(items);
  //   }
  // }

  return (
    <StoreContext.Provider value={{ basket, setBasket }}>
      {children}
    </StoreContext.Provider>
  );
}
