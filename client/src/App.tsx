import React from 'react';
import './App.css';

const App = () => {
  const products = [
    {name: '走れメロス', price: 1500},
    {name: '罪と罰', price: 1000}
  ]

  return (
    <div>
      <h1>本の森</h1>
      <ul>
        {
          products.map((product) => (
            <div>
              {product.name} - {product.price}円
            </div>
          ))
        }
      </ul>
    </div>
  )
}

export default App;
