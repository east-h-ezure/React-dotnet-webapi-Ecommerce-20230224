// import React, { useEffect, useState } from 'react';
// import { Basket } from '../../app/models/basket';
// import { Product } from '../../product';

// interface Props {
//   basket: Basket;
// }

// const BasketCard = ({ basket } Props) => {
//   const [product, setProduct] = useState<Product | null>(null);

//   // useEffect(() => {
//   //   fetch(`https://localhost:5000/api/products/${productId}`, { mode: 'cors' })
//   //     .then((response) => response.json())
//   //     .then((data) => setProduct(data));
//   // }, [productId]);

//   useEffect(() => {
//     try {
//       fetch(`https://localhost:5000/api/basketitem?basketId=${basketItem}`, {
//         mode: 'cors',
//       })
//         .then((response) => response.json())
//         .then((data) => setBaskets(data));
//     } catch (error) {
//       console.error(error);
//     }
//   }, [basket.id]);

//   if (!product) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <div>Name: {product.name}</div>
//       <div>Price: {product.price}</div>
//       {/* 他の情報もここに表示する */}
//     </div>
//   );
// };

// export default BasketCard;
import React from 'react';

const BasketCard = () => {
  return <div>BasketCard</div>;
};

export default BasketCard;
