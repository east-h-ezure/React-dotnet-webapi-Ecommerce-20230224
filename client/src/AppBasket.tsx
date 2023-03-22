import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BasketConfirm } from './app/models/basket';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Fab,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { makeStyles, createStyles } from '@mui/styles';
import Icon from '@mui/material/Icon';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from './app/layout/Loading';
import config from './app/api/config';
import { LoadingButton } from '@mui/lab';
import { Product } from './product';
import { Link } from 'react-router-dom';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    textField: {
      maxWidth: 60,
      // marginLeft: theme.spacing(1),
      // marginRight: theme.spacing(1),
      //marginLeft: '30%',
      // marginRight: '30%',
      fontSize: 5,
    },
    image: {
      maxWidth: 50,
      maxHeight: 50,
    },
  })
);

const AppBasket = () => {
  const classes = useStyles();
  const [status, setStatus] = useState({
    loading: true,
    name: '',
  });
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
      setStatus({ loading: false, name: '' });
    };
    fetchBasketItems();
  }, [basketId]);

  // // const { basket } = useStoreContext();
  // const itemCount = basketItems.reduce((sum, items))
  // ステップ1
  let totalItemCount = 0;

  // ステップ2
  basketItems.forEach((item) => {
    totalItemCount += item.quantity;
  });
  console.log(totalItemCount);

  console.log(basketItems);

  //小計
  let amount = 0;
  basketItems.forEach((item) => {
    amount += item.product.price * item.quantity;
  });
  console.log(amount);
  let postage = 0;
  if (amount >= 5000) {
    postage = 0;
  } else {
    postage = 500;
  }
  console.log(postage);
  if (status.loading) return <Loading message="Loaging basket..." />;

  const handleAddItem = async (
    productId: number,
    quantity = 1,
    name: string
  ) => {
    setStatus({ loading: true, name: name });
    try {
      const response = await fetch(
        `${config.API_URL}Basket?productId=${productId}&quantity=${quantity}&userId=aa`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        }
      );
      const data = await response.json();
      const basketItems = data?.items?.map((item: BasketConfirm) => {
        return {
          basketId: item.basketId,
          quantity: item.quantity,
          product: item.product,
        };
      });
      setBasketItems(basketItems);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setStatus({ loading: false, name: '' });
      window.location.reload();
    }
  };
  const handleRemoveItem = async (
    productId: number,
    quantity = 1,
    name: string
  ) => {
    setStatus({ loading: true, name });
    try {
      const response = await fetch(
        `${config.API_URL}Basket?productId=${productId}&quantity=${quantity}&userId=aa`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        }
      );
      const data = await response.json();
      const basketItems = data?.items?.map((item: BasketConfirm) => {
        return {
          basketId: item.basketId,
          quantity: item.quantity,
          product: item.product,
        };
      });
      setBasketItems(basketItems);
    } catch (error) {
      console.error(error);
    } finally {
      setStatus({ loading: false, name: '' });
      window.location.reload();
    }
  };

  return (
    <>
      <Grid container spacing={2} sx={{ display: 'flex' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right"></TableCell>
                <TableCell>商品名</TableCell>
                <TableCell align="right">価格</TableCell>
                <TableCell align="center">数量</TableCell>
                <TableCell align="center">削除</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {basketItems.map((item) => (
                <TableRow
                  key={item.basketId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box display="flex" alignItems="right">
                      <img
                        style={{ height: 50 }}
                        src={item.product.pictureUrl}
                        alt={item.product.name}
                      />
                      {/* <span>{item.product.name.trim()}</span> */}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: '15%' }}>
                    {item.product.name.trim()}
                  </TableCell>
                  <TableCell align="right">
                    ${(item.product.price / 100).toFixed(2)}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ justifyContent: 'space-between' }}
                  >
                    <LoadingButton
                      loading={status.loading}
                      onClick={() =>
                        handleRemoveItem(item.product.id, 1, item.product.name)
                      }
                    >
                      <RemoveIcon
                        sx={{ marginRight: 1, paddingTop: 1 }}
                        color="error"
                      />
                    </LoadingButton>
                    {item.quantity}
                    <LoadingButton
                      loading={status.loading}
                      onClick={() =>
                        handleAddItem(item.product.id, 1, item.product.name)
                      }
                    >
                      <AddIcon sx={{ marginLeft: 1, paddingTop: 1 }} />
                    </LoadingButton>
                  </TableCell>
                  <TableCell align="center">
                    <LoadingButton
                      loading={status.loading}
                      onClick={() =>
                        handleAddItem(
                          item.product.id,
                          item.quantity,
                          item.product.name
                        )
                      }
                    >
                      <DeleteIcon color="error" />
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container>
          <Grid item xs={6} />
          <Grid item xs={6}>
            <TableContainer component={Paper} variant={'outlined'}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={2}>小計</TableCell>
                    <TableCell align="right">{amount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>送料*</TableCell>
                    <TableCell align="right">{postage}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell align="right">{amount + postage}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <span style={{ fontStyle: 'italic' }}>
                        *5000円以上購入で送料無料になります
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              component={Link}
              to="/checkout"
              variant="contained"
              size="large"
              fullWidth
            >
              レジに進む
            </Button>
          </Grid>
        </Grid>
        {/* <Grid item xs={4} sx={{ position: 'relative' }}>
          <CardContent sx={{ position: 'relative', top: 515 }}></CardContent> */}
        {/* <Box sx={{ position: 'relative' }}>
          <Box sx={{ position: 'relative', top: 515 }}>
            <Typography variant="h6">
              小計: <span>{amount}円</span>
            </Typography>
            <Typography variant="h6">送料: {postage}円</Typography>
            {/* <div>5000以上で送料無料！</div> */}
        {/* <Typography variant="h6">合計: {amount + postage}円</Typography>
            <Button
              fullWidth
              // sx={{ width: '80%', alignItems: 'center' }}
              variant="contained"
            >
              チェックアウト
            </Button>
          </Box>
        </Box> */}
      </Grid>
    </>
  );
};

export default AppBasket;
