import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [ products, setProducts ] = useState(
    [
      {name: '走れメロス', price: 1500},
      {name: '罪と罰', price: 1000},
      {name: 'チーズはどこに消えた？', price: 1600}
    ]
  )
  const addProducts = () => {
    setProducts([...products, { name: '七つの習慣', price: 2000 }])
  }


  return (
    <div>
      <h1>本の森</h1>
      <ul>
        {
          products.map((product) => (
            <li>
              {product.name} - {product.price}円
            </li>
          ))
        }
      </ul>
      <button onClick={addProducts}>商品の追加</button>
    </div>
  )
}
export default App;
