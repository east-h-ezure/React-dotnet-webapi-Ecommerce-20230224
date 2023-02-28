import { Product } from '../../product'
import {
  Button
} from '@mui/material'
import ProductList from './ProductList';

interface Props {
  products: Product[];
  addProduct: () => void;
}
const Catalog = ({products, addProduct}: Props) => {
  return (
    <div>
      <ProductList products={products} />
      <Button onClick={addProduct}>商品の追加</Button>
    </div>
  )
}

export default Catalog;