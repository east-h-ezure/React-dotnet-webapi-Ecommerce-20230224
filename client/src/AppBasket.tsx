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
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Typography sx={{ marginTop: 3 }} variant="h4">
            買い物かご
          </Typography>
          <TableContainer
            component={Paper}
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              marginTop: 10,
            }}
          >
            <Table aria-label="simple table">
              {/* sx={{ minWidth: 650 }} */}
              <TableHead>
                <TableRow>
                  <TableCell align="right"></TableCell>
                  <TableCell align="center">商品名</TableCell>
                  <TableCell align="center">数量</TableCell>
                  <TableCell align="center">価格</TableCell>
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
                      <Box display="flex" alignItems="center"></Box>
                      <img
                        className={classes.image}
                        src={item.product.pictureUrl}
                        alt={item.product.name}
                        style={{ height: 50, marginRight: 29 }}
                      />
                    </TableCell>
                    <TableCell>{item.product.name.trim()}</TableCell>
                    {/* <TableCell>{item.quantity}</TableCell> */}
                    <TableCell>
                      <Box
                        sx={{ '& > :not(style)': { m: 1 } }}
                        className={classes.root}
                      >
                        {/* TODO */}
                        <LoadingButton
                          loading={
                            status.loading &&
                            status.name === 'add' + item.product.id
                          }
                          onClick={() =>
                            handleAddItem(
                              item.product.id,
                              1,
                              'add' + item.product.id
                            )
                          }
                        >
                          <AddIcon />
                        </LoadingButton>
                        <Typography variant="subtitle1" sx={{ width: 30 }}>
                          {item.quantity}
                        </Typography>
                        <LoadingButton
                          loading={
                            status.loading &&
                            status.name === 'add' + item.product.id
                          }
                          onClick={() =>
                            handleRemoveItem(
                              item.product.id,
                              1,
                              'rem' + item.product.id
                            )
                          }
                        >
                          <RemoveIcon />
                        </LoadingButton>
                      </Box>
                    </TableCell>
                    <TableCell>{item.product.price * item.quantity}</TableCell>
                    <TableCell>
                      <LoadingButton
                        loading={
                          status.loading &&
                          status.name === 'add' + item.product.id
                        }
                        onClick={() =>
                          handleRemoveItem(
                            item.product.id,
                            item.quantity,
                            'rem' + item.product.id
                          )
                        }
                      >
                        <Button>
                          <DeleteIcon color="error" />
                        </Button>
                      </LoadingButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={4} sx={{ position: 'relative' }}>
          <CardContent sx={{ position: 'relative', top: 515 }}>
            <Card>
              <Typography variant="h6">
                小計: <span>{amount}円</span>
              </Typography>
              <Typography variant="h6">送料: {postage}円</Typography>
              {/* <div>5000以上で送料無料！</div> */}
              <Typography variant="h6">合計: {amount + postage}円</Typography>
              <Button
                fullWidth
                // sx={{ width: '80%', alignItems: 'center' }}
                variant="contained"
              >
                チェックアウト
              </Button>
            </Card>
          </CardContent>
        </Grid>
      </Grid>
      <h1>ここから</h1>
      <Grid container spacing={1} sx={{ display: 'flex' }}>
        <TableContainer component={Paper} sx={{ width: '65%' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>商品名</TableCell>
                <TableCell align="right">価格</TableCell>
                <TableCell align="center">数量</TableCell>
                <TableCell align="right">小計</TableCell>
                <TableCell align="right">削除</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {basketItems.map((item) => (
                <TableRow
                  key={item.basketId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box display="flex" alignItems="center">
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
                    <RemoveIcon
                      sx={{ marginRight: 1, paddingTop: 1 }}
                      color="error"
                    />
                    {item.quantity}
                    <AddIcon sx={{ marginLeft: 1, paddingTop: 1 }} />
                  </TableCell>
                  <TableCell align="right">
                    {item.product.price * item.quantity}
                  </TableCell>
                  <TableCell align="right">
                    <Button>
                      <DeleteIcon color="error" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* <Grid item xs={4} sx={{ position: 'relative' }}>
          <CardContent sx={{ position: 'relative', top: 515 }}></CardContent> */}
        <Box sx={{ position: 'relative' }}>
          <Box sx={{ position: 'relative', top: 515 }}>
            <Typography variant="h6">
              小計: <span>{amount}円</span>
            </Typography>
            <Typography variant="h6">送料: {postage}円</Typography>
            {/* <div>5000以上で送料無料！</div> */}
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
    </>
  );
};

export default AppBasket;
