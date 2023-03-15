import { Product } from '../../product';

export interface BasketItem {
  productId: number;
  basketId: string; //guid
  quantity: number;
  product: Product[];
}

export interface Basket {
  userId: string;
  id: string; //guid
  items: BasketItem[];
}

export interface BasketConfirm {
  basketId: string;
  quantity: number;
  product: Product;
}
