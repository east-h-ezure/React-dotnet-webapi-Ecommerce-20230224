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

export interface ProductParams {
  sort: string;
  search?: string;
  types: string[];
  brands: string[];
  page: number;
  pageSize: number;
}
