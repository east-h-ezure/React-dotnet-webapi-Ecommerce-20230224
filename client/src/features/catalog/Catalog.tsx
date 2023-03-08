import { Product } from '../../product';
import { Button } from '@mui/material';
import ProductList from './ProductList';
import { useEffect, useState } from 'react';
import agent from '../../app/api/agent';

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
    // agent.Catalog.list().then((products) => setProducts(products));
  }, []);

  return (
    <div>
      <ProductList products={products} />
    </div>
  );
};

export default Catalog;
