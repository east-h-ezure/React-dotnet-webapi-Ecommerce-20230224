import { Basket, BasketItem } from '../../app/models/basket';
import { createSlice } from '@reduxjs/toolkit';

interface BasketState {
  basket: Basket | null;
  basketItem: BasketItem[];
}

const initialState: BasketState = {
  basket: null,
  basketItem: [],
};

export const basketSlice = createSlice({
  name: 'basketItem',
  initialState,
  reducers: {
    //!! get basketItem
    // setBasket: (state, action) => {
    //   state.basket = action.payload;
    // },
    setBasketItem: (state, action) => {
      state.basketItem = action.payload;
    },
    //!! removeの方はbasket
    removeItem: (state, action) => {
      const { productId, quantity, id } = action.payload;
      //basketItemテーブルの方?

      const itemIndex = state.basket?.items.findIndex(
        (i) => i.productId === productId
      );
      // const basketItemIndex = state.basketItem?.product.findIndex(
      //   (i) => i.id === id
      // );

      if (itemIndex === -1 || itemIndex === undefined) return;
      //basketはnullの可能性があるから!を付ける
      state.basket!.items[itemIndex].quantity -= quantity;
      if (state.basket?.items[itemIndex].quantity === 0)
        state.basket.items.splice(itemIndex, 1);

      //   if (basketItemIndex === -1 || basketItemIndex === undefined) return;
      // //basketはnullの可能性があるから!を付ける
      // state.basketItem.quantity -= quantity;
      // if (state.basket?.items[itemIndex].quantity === 0)
      //   state.basket.items.splice(itemIndex, 1);
    },
  },
});

export const { removeItem, setBasketItem } = basketSlice.actions;
