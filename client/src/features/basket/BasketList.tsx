// import React from 'react';
// import { BasketConfirm, BasketConfirm, BasketItem } from '../../app/models/basket';
// import BasketCard from './BasketCard';

// interface Props {
//   baskets: BasketConfirm[];
// }

// export interface BasketConfirm {
//   basketId: string;
//   quantity: number;
//   product: Product;
// }

// const BasketList: React.FC<Props> = ({ baskets }) => {
//   useEffect(() => {
//     try {
//       fetch(`https://localhost:5000/api/basketitem?basketId=${basket.id}`, {
//         mode: 'cors',
//       })
//         .then((response) => response.json())
//         .then((data) => setBaskets(data));
//     } catch (error) {
//       console.error(error);
//     }
//   }, [basket.id]);
//   return (
//     <div>
//       {baskets.map((basket) => (
//         <div key={basket.productId}>
//           <BasketCard basket={basket} />
//           {/* <div>Quantity: {basket.quantity}</div> */}
//           {/* 他の情報もここに表示する */}
//           {/* <div>{basket.basketId}</div> */}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default BasketList;
import React from 'react';

const BasketList = () => {
  return <div>BasketList</div>;
};

export default BasketList;
