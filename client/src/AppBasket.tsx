import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Basket, BasketItem } from './app/models/basket';
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
import { Product } from './app/models/product';
import { Link } from 'react-router-dom';
import { useStoreContext } from './app/context/StoreContext';
import { useAppDispatch, useAppSelector } from './app/store/configureStore.1';
import { setBasket } from './features/basket/basketSlice';
import agent from './app/api/agent';
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
  const dispatch = useAppDispatch();
  const { basket } = useAppSelector((state) => state.basket);
  const classes = useStyles();
  // const [status, setStatus] = useState({
  //   loading: true,
  //   name: '',
  // });
  const [loading, setLoading] = useState(true);
  const [basketState, setBasketState] = useState<Basket[]>([]);
  // const [basketId, setBasketId] = useState<string>(
  //   'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21'
  // );
  const [basketId, setBasketId] = useState<number>(1);
  const [item, setItem] = useState([]);
  // const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchBasketItems = async () => {
      const response = await axios.get(
        `https://localhost:5000/api/Basket?basketId=${basketId}`
      );
      // setBasketItems(response.data);
      dispatch(setBasket(response.data));
      setLoading(false);
      console.log(setBasket);
    };
    fetchBasketItems();
  }, [dispatch]);

  useEffect(() => {
    const fetchBasketItems = async () => {
      const response = await axios.get(
        `https://localhost:5000/api/Basket?basketId=${basketId}`
      );
      // setBasketItems(response.data);
      setBasketState(response.data);
      setLoading(false);
      console.log(setBasketState);
    };
    fetchBasketItems();
  }, [basketId]);
  console.log('setBasket', setBasket);
  console.log('basket', basket);
  console.log('basketState', basketState);

  // useEffect(() => {
  //   const fetchBasket = async () => {
  //     const response = await axios.get(
  //       `https://localhost:5000/api/Basket?basketId=${basketId}`
  //     );
  //     // setBasketItems(response.data);
  //     dispatch(setBasket(response.data));
  //     setStatus({ loading: false, name: '' });
  //     console.log('setBasket', setBasket);
  //   };
  //   fetchBasket();
  // }, [basketId]);
  //コメントアウト
  // useEffect(() => {
  //   const fetchBasket = async () => {
  //     /* const response = await axios.get(
  //       `https://localhost:5000/api/Basket?basketId=${basketId}`
  //     ); */
  //     if (basketId) {
  //       agent.Basket.get(basketId)
  //         .then((basket) => dispatch(setBasket(basket)))
  //         .catch((error) => console.log(error))
  //         .finally(() => setLoading(false));
  //     }
  //     // setBasketItems(response.data);
  //     // dispatch(setBasket(response.data));
  //     // setLoading(false);
  //     console.log('setBasket', setBasket);
  //     // console.log('item', item);
  //   };
  //   fetchBasket();
  // }, [basketId]);

  // // const { basket } = useStoreContext();
  // const itemCount = basketItems.reduce((sum, items))
  // ステップ1
  let totalItemCount = 0;

  // ステップ2
  // basket?.items.forEach((item) => {
  //   totalItemCount += item.quantity;
  // });
  // console.log(totalItemCount);

  console.log(basket);
  // onsole.log('aa', basketItem);

  //小計
  let amount = 0;
  // basket?.items.forEach((item) => {
  //   amount += item.price * item.quantity;
  // });
  console.log(amount);
  let postage = 0;
  if (amount >= 5000) {
    postage = 0;
  } else {
    postage = 500;
  }
  console.log(postage);
  if (loading) return <Loading message="Loaging basket..." />;

  const handleAddItem = async (
    productId: number,
    quantity = 1,
    name: string
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.API_URL}Basket?productId=${productId}&quantity=${quantity}&buyerId=test-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        }
      );
      const data = await response.json();
      const basket = data?.items?.map((item: BasketItem) => {
        return {
          productId: item.productId,
          name: item.name,
          price: item.price,
          pictureUrl: item.pictureUrl,
          brand: item.brand,
          type: item.type,
          quantity: item.quantity,
        };
      });
      setBasket(basket);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };
  const handleRemoveItem = async (
    productId: number,
    quantity = 1,
    name: string
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.API_URL}Basket?productId=${productId}&quantity=${quantity}&buyerId=test-user`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        }
      );
      const data = await response.json();
      const basket = data?.items?.map((item: BasketItem) => {
        return {
          // basketId: item.basketId,
          // quantity: item.quantity,
          // product: item.product,
          productId: item.productId,
          name: item.name,
          price: item.price,
          pictureUrl: item.pictureUrl,
          brand: item.brand,
          type: item.type,
          quantity: item.quantity,
        };
      });
      setBasket(basket);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
              {basketState[0]?.items.map((item) => (
                <TableRow
                  // key={item.basketId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box display="flex" alignItems="right">
                      <img
                        style={{ height: 50, width: 50 }}
                        src={item.pictureUrl}
                        alt={item.name}
                      />
                      <span>{item.name.trim()}</span>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: '15%' }}>{item.name}</TableCell>
                  <TableCell align="right">
                    ${(item.price / 100).toFixed(2)}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ justifyContent: 'space-between' }}
                  >
                    <LoadingButton
                      loading={loading}
                      onClick={() =>
                        handleRemoveItem(item.productId, 1, item.name)
                      }
                    >
                      <RemoveIcon
                        sx={{ marginRight: 1, paddingTop: 1 }}
                        color="error"
                      />
                    </LoadingButton>
                    {item.quantity}
                    <LoadingButton
                      loading={loading}
                      onClick={() =>
                        handleAddItem(item.productId, 1, item.name)
                      }
                    >
                      <AddIcon sx={{ marginLeft: 1, paddingTop: 1 }} />
                    </LoadingButton>
                  </TableCell>
                  <TableCell align="center">
                    <LoadingButton
                      loading={loading}
                      onClick={() =>
                        handleRemoveItem(
                          item.productId,
                          item.quantity,
                          item.name
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
        <Grid item xs={4} sx={{ position: 'relative' }}>
          <CardContent sx={{ position: 'relative', top: 515 }}></CardContent>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'relative', top: 515 }}>
              <Typography variant="h6">
                小計: <span>{amount}円</span>
              </Typography>
              <Typography variant="h6">送料: {postage}円</Typography>
              <div>5000以上で送料無料！</div>
              <Typography variant="h6">合計: {amount + postage}円</Typography>
              <Button
                fullWidth
                // sx={{ width: '80%', alignItems: 'center' }}
                variant="contained"
              >
                チェックアウト
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* {basket?.map(
        (basketItem: {
          id: number;
          buyerId: string;
          items: {
            productId: number;
            name: string;
            price: number;
            brand: string;
            type: string;
            quantity: number;
          }[];
        }) => (
          <div key={basketItem.id}>
            <div>{basketItem.buyerId}</div>
            {basketItem.items.map(
              (item: {
                productId: number;
                name: string;
                price: number;
                brand: string;
                type: string;
                quantity: number;
              }) => (
                <div key={item.productId}>
                  <div>{item.name}</div>
                  <div>{item.price}</div>
                  <div>{item.brand}</div>
                  <div>{item.type}</div>
                  <div>{item.quantity}</div>
                </div>
              )
            )}
          </div>
        )
      )}
      {/* <ul>
        {basket?.map((item) => (
          <li key={item.id}>
            {item.buyerId}
            <ul>
              {item.items.map((basketItem) => (
                <li key={basketItem.productId}>
                  {basketItem.name} x {basketItem.quantity}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul> */}
    </>
  );
};

export default AppBasket;
