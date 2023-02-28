import React, { useEffect, useState } from 'react';
import './App.css';
import { Product } from './product';
import Catalog from './features/catalog/Catalog';
import { Typography } from '@mui/material';

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      fetch('https://localhost:5000/api/products', { mode: "cors" })
        .then(response => response.json())
        .then(data => setProducts(data));
    } catch (error) {
      console.error(error); // エラーが発生した行を特定するために、コンソールにエラーを出力する
    }
  }, []);

  const addProduct = () => {
    setProducts(prevState => [...prevState,
      {
        id: prevState.length + 101,
        name: '書籍' + (prevState.length + 1),
        price: (prevState.length * 100) + 100,
        brand: '村上春樹',
        description: 'なんかの本',
        pictureUrl: 'http://picsum.photos/200'
      }] as Product[])
  }

  return (
    <div>
      <Typography variant='h2'>本の海</Typography>
      <Catalog products={products} addProduct={addProduct} />
    </div>
  );
}

export default App;
