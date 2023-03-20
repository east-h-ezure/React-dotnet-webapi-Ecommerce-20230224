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
import Loading from './app/layout/Loading';
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
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
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
  if (loading) return <Loading message="Loaging basket..." />;

  return (
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
                  <TableCell>
                    <img
                      className={classes.image}
                      src={item.product.pictureUrl}
                      alt={item.product.name}
                    />
                  </TableCell>
                  <TableCell>{item.product.name.trim()}</TableCell>
                  {/* <TableCell>{item.quantity}</TableCell> */}
                  <TableCell>
                    <div>
                      <Box
                        sx={{ '& > :not(style)': { m: 1 } }}
                        className={classes.root}
                      >
                        <IconButton>
                          <AddIcon />
                        </IconButton>
                        <Typography
                          variant="subtitle1"
                          sx={{ width: 30, textAlign: 'center' }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton>
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    </div>
                  </TableCell>
                  <TableCell>{item.product.price * item.quantity}</TableCell>
                  <TableCell>
                    <Button>削除</Button>
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
              小計: <span>〇円</span>
            </Typography>
            <Typography variant="h6">送料: 〇円</Typography>
            {/* <div>5000以上で送料無料！</div> */}
            <Typography variant="h6">合計: 〇円</Typography>
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
  );
};

export default AppBasket;
