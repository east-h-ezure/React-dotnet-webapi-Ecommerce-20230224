export interface Product {
  find(arg0: (i: any) => boolean): unknown;
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
  brand: string;
  pictureUrl: string;
  quantityInStock: number;
  //publisher: string;
}
