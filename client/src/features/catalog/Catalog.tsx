import { Product } from '../../app/models/product';
import { Button } from '@mui/material';
import ProductList from './ProductList';
import { useEffect, useState } from 'react';

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      fetch('https://localhost:5000/api/products', { mode: 'cors' })
        .then((response) => response.json())
        .then((data) => setProducts(data));
    } catch (error) {
      console.error(error); // エラーが発生した行を特定するために、コンソールにエラーを出力する
    }
  }, []);

  return (
    <div>
      <ProductList products={products} />
    </div>
  );
};

export default Catalog;
