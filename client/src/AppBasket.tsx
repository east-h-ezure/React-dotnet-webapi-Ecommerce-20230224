import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BasketConfirm } from './app/models/basket';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

function AppBasket() {
  const [basketItems, setBasketItems] = useState<BasketConfirm[]>([]);
  const [basketId, setBasketId] = useState<string>(
    'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21'
  );

  useEffect(() => {
    const fetchBasketItems = async () => {
      const response = await axios.get(
        `https://localhost:5000/api/BasketItem?basketId=${basketId}`
      );
      setBasketItems(response.data);
    };
    fetchBasketItems();
  }, [basketId]);

  console.log(basketItems);

  return (
    <div>
      {/* <ul> */}
      {/* {basketItems.map((item) => (
          <li key={item.basketId}>
            {item.product.name}: {item.quantity}
            {item.product.brand}
          </li>
        ))}
      </ul> */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>商品名</TableCell>
              <TableCell>数量</TableCell>
              <TableCell>価格</TableCell>
              <TableCell>削除</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basketItems.map((item) => (
              <TableRow
                key={item.basketId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{item.product.pictureUrl}</TableCell>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.product.price * item.quantity}</TableCell>
                <TableCell>削除ボタン追加する</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AppBasket;
