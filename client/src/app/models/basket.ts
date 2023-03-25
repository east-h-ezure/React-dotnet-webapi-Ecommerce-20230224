import { Product } from './product';

// export interface BasketItem {
//   productId: number;
//   basketId: string; //guid
//   quantity: number;
//   product: Product[];
// }

// export interface Basket {
//   userId: string;
//   id: string; //guid
//   items: BasketItem[];
// }

// export interface BasketConfirm {
//   basketId: string;
//   quantity: number;
//   product: Product[];
//   // product: Product;
// }
export interface BasketItem {
  productId: number;
  name: string;
  price: number;
  pictureUrl: string;
  brand: string;
  type: string;
  quantity: number;
}

export interface Basket {
  id: number;
  buyerId: string;
  items: BasketItem[];
}
