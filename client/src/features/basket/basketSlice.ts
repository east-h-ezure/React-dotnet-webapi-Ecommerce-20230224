// import { Basket, BasketItem } from '../../app/models/basket';
// import { createSlice } from '@reduxjs/toolkit';

// interface BasketState {
//   basket: Basket & { items: BasketItem[] };
//   basketItem: BasketItem[];
// }

// const initialState: BasketState = {
//   basket: { id: 0, buyerId: '', items: [] },
//   basketItem: [],
// };

// export const basketSlice = createSlice({
//   name: 'basket',
//   //変更前のコード
//   // name: 'basketItem',
//   initialState,
//   reducers: {
//     //!! get basketItem
//     setBasket: (state, action) => {
//       state.basket = action.payload;
//     },
//     /* setBasketItem: (state, action) => {
//       state.basketItem = action.payload;
//     }, */
//     //!! removeの方はbasket
//     removeItem: (state, action) => {
//       const { productId, quantity, id } = action.payload;
//       //basketItemテーブルの方?

//       const itemIndex = state.basket?.items.findIndex(
//         (i) => i.productId === productId
//       );
//       // const basketItemIndex = state.basketItem?.product.findIndex(
//       //   (i) => i.id === id
//       // );

//       if (itemIndex === -1 || itemIndex === undefined) return;
//       //basketはnullの可能性があるから!を付ける
//       state.basket!.items[itemIndex].quantity -= quantity;
//       if (state.basket?.items[itemIndex].quantity === 0)
//         state.basket.items.splice(itemIndex, 1);

//       //   if (basketItemIndex === -1 || basketItemIndex === undefined) return;
//       // //basketはnullの可能性があるから!を付ける
//       // state.basketItem.quantity -= quantity;
//       // if (state.basket?.items[itemIndex].quantity === 0)
//       //   state.basket.items.splice(itemIndex, 1);
//     },
//   },
// });

// export const { removeItem, setBasket } = basketSlice.actions;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import agent from '../../app/api/agent';
import { Basket } from '../../app/models/basket';

interface BasketState {
  basket: Basket[];
  status: string;
}

const initialState: BasketState = {
  basket: [],
  status: 'idle',
};

// export const addBasketItemAsync = createAsyncThunk<Basket, {productId: number, quantity?: number}>(
//     'basket/addBasketItemAsync',
//     async ({productId, quantity = 1}, thunkAPI) => {
//         try {
//             return await agent.Basket.addItem(productId, quantity);
//         } catch (error: any) {
//             return thunkAPI.rejectWithValue({error: error.data})
//         }
//     }
// )

// export const removeBasketItemAsync = createAsyncThunk<void,
//     {productId: number, quantity: number, name?: string}>(
//     'basket/removeBasketItemASync',
//     async ({productId, quantity}, thunkAPI) => {
//         try {
//             await agent.Basket.removeItem(productId, quantity);
//         } catch (error: any) {
//             return thunkAPI.rejectWithValue({error: error.data})
//         }
//     }
// )

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    setBasket: (state, action) => {
      state.basket = action.payload;
    },
  },
  // extraReducers: builder => {
  //     builder.addCase(addBasketItemAsync.pending, (state, action) => {
  //         state.status = 'pendingAddItem' + action.meta.arg.productId;
  //     });
  //     builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
  //         state.basket = action.payload;
  //         state.status = 'idle';
  //     });
  //     builder.addCase(addBasketItemAsync.rejected, (state, action) => {
  //         state.status = 'idle';
  //         console.log(action.payload);
  //     });
  //     builder.addCase(removeBasketItemAsync.pending, (state, action) => {
  //         state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;
  //     })
  //     builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
  //         const { productId, quantity } = action.meta.arg;
  //         const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);
  //         if (itemIndex === -1 || itemIndex === undefined) return;
  //         state.basket!.items[itemIndex].quantity -= quantity;
  //         if (state.basket?.items[itemIndex].quantity === 0)
  //             state.basket.items.splice(itemIndex, 1);
  //         state.status = 'idle';
  //     });
  //     builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
  //         state.status = 'idle';
  //         console.log(action.payload);
  //     })
  // }
});

export const { setBasket } = basketSlice.actions;
