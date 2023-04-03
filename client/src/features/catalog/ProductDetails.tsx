import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Product } from '../../app/models/product';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Input,
  TableBody,
  tableBodyClasses,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Favorite, Remove } from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { LoadingButton } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { isTemplateExpression } from 'typescript';
import { Basket, BasketItem } from '../../app/models/basket';

const StyledTypography = styled(Typography)({
  fontSize: 15,
});
const StypledTableRow = styled(TableRow)({
  borderBottom: 'none',
  borderColor: 'white',
});

const StledIconButton = styled(IconButton)({
  position: 'absolute',
  top: 10,
  right: 10,
  color: 'red',
  zIndex: 2,
});

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [basketItem, setBasketItem] = useState<BasketItem[]>([]);
  const [basketId, setBasketId] = useState<string>('1');
  const [submitting, setSubmitting] = useState(false);
  const [productId] = useState<number>();

  //basketitemのget
  // const fetchProducts = async () => {
  //   const response = await axios.get(
  //     `https://localhost:5000/api/Products/${id}`
  //   );
  //   setProduct(response.data);
  //   setLoading(false);
  // };

  // 初回レンダリング時に一度だけ実行
  // useEffect(() => {
  //   fetchProducts();
  // }, [id]);
  // const item = basketItem?.find((i) => i.product.id === product?.id);
  // useEffect(() => {
  //   if (item) setQuantity(item.quantity);
  // }, [item]);

  const handleInputChage = (event: any) => {
    if (event.target.value > 0) {
      setQuantity(parseInt(event.target.value));
    }
  };

  // useEffect(() => {
  //   // if (item) setQuantity(item?.quantity);
  //   axios
  //     .get(`https://localhost:5000/api/products/${id}`)
  //     .then((res) => setProduct(res.data))
  //     .catch((error) => console.log(error))
  //     .finally(() => setLoading(false));
  // }, [id]);
  useEffect(() => {
    try {
      fetch(`https://localhost:5000/api/products/${id}`, { mode: 'cors' })
        .then((response) => response.json())
        .then((data) => {
          setProduct(data);
          setLoading(false); // データ取得後にローディングを非表示にする
        });
    } catch (error) {
      console.error(error); // エラーが発生した行を特定するために、コンソールにエラーを出力する
    }
  }, [id]);
  console.log('id', id);
  console.log('productId', productId);

  console.log('product', product);

  if (loading) return <h3>Loading...</h3>;
  if (product == null) return <h3>商品が見つかりません</h3>;

  console.log('quantity', quantity);
  console.log('basketItem', basketItem);

  // const handleUpdateCart = (
  //   productId: number,
  //   quantity: number,
  //   name: string
  // ) => {
  //   setSubmitting(true);
  //   if (!item || quantity > item?.quantity) {
  //     const updatedQuantity = item ? quantity - item.quantity : quantity;
  //     try {
  //       const response = fetch(
  //         `https://localhost:5000/api/Basket?productId=${productId}&quantity=${updatedQuantity}&userId=aa`,
  //         {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           mode: 'cors',
  //         }
  //       );
  //       const data = response.json();
  //       const basketItems = data?.items?.map((item: BasketConfirm) => {
  //         return {
  //           basketId: item.basketId,
  //           quantity: item.quantity,
  //           product: item.product,
  //         };
  //       });
  //       setBasketItem(basketItems);
  //       window.location.reload();
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setSubmitting(false);
  //       window.location.reload();
  //     }
  //   } else {
  //     const updatedQuantity = item.quantity - quantity;
  //     agent.Basket.removeItem(product?.id!, updatedQuantity)
  //       .then(() => removeItem(product?.id!, updatedQuantity))
  //       .catch((error) => console.log(error))
  //       .finally(() => setSubmitting(false));
  //   }
  // };

  return (
    // <Grid container sx={{ mt: 3 }}>
    //   <div>{product.name}</div>
    // </Grid>
    <Grid container spacing={6} sx={{ mt: 0.5 }}>
      <Grid item xs={4}>
        {/* <Box display="flex" alignItems="right">
          <img
            src={product.pictureUrl}
            // src="images/products/snow-coat.jpg"
            alt={product.name}
            // style={{ width: '100%', position: 'relative' }}
          />
        </Box> */}
        <ImageList
          sx={{ width: 500, height: 450 }}
          variant="quilted"
          cols={4}
          rowHeight={121}
        >
          <ImageListItem key={product.pictureUrl} cols={1} rows={1}>
            <img
              // {...srcset(product.pictureUrl, 121, 1, 1)}
              src={product.pictureUrl}
              alt={product.name}
              loading="lazy"
            />
          </ImageListItem>
        </ImageList>
        <StledIconButton aria-label="like">
          <Favorite fontSize="large" />
        </StledIconButton>
      </Grid>
      <Grid item xs={7}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography gutterBottom color="red" variant="h4" sx={{ mb: 2 }}>
          {product.price.toLocaleString('ja-JP', {
            style: 'currency',
            currency: 'JPY',
          })}
        </Typography>
        <TableContainer sx={{ width: '100%' }}>
          <TableBody>
            <StypledTableRow>
              <TableCell>
                <StyledTypography fontWeight="fontWeightBold">
                  カテゴリー
                </StyledTypography>
              </TableCell>
              <TableCell>
                <StyledTypography>{product.type}</StyledTypography>
              </TableCell>
            </StypledTableRow>
            <TableRow>
              <TableCell>
                <StyledTypography fontWeight="fontWeightBold">
                  ブランド
                </StyledTypography>
              </TableCell>
              <TableCell>
                <StyledTypography>{product.brand}</StyledTypography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <StyledTypography fontWeight="fontWeightBold">
                  在庫数
                </StyledTypography>
              </TableCell>
              <TableCell>
                <StyledTypography>{product.quantityInStock}</StyledTypography>
              </TableCell>
            </TableRow>
          </TableBody>
        </TableContainer>

        <Divider />
        <Typography
          variant="h6"
          fontWeight="fontWeightBold"
          sx={{ mt: 2, mb: 2 }}
        >
          商品について
        </Typography>
        <Typography variant="subtitle1">{product.description}</Typography>
        <Grid
          sx={{
            display: 'flex',
            mt: 4,
            mb: 2,
            justifyContent: 'flex-start',
          }}
          container
        >
          <Grid item xs={4}>
            <Typography variant="h6" fontWeight="fontWeightBold">
              金額:
              {product.price * quantity}円
            </Typography>
          </Grid>
          {/* {basketItem.map((item) => {
              if (item.product.id === product.id) {
                return (
                  <Grid item xs={4}>
                    {/* onClick={() => setQuantity(quantity + 1)} */}
          {/* <TextField
                      onChange={handleInputChage}
                      variant="outlined"
                      type="number"
                      //label="quantity in cart"
                      fullWidth
                      value={quantity}
                    />
                    <Button
                      // loading={status.loading}
                      onClick={() => setQuantity(quantity - 1)}
                    >
                      <RemoveIcon
                        sx={{ marginRight: 1, paddingTop: 1 }}
                        color="error"
                      />
                    </Button>
                    {quantity}
                    <LoadingButton
                      // loading={status.loading}
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <AddIcon sx={{ marginLeft: 1, paddingTop: 1 }} />
                    </LoadingButton>
                    <LoadingButton>
                      <Button
                        //onClick={() => handleUpdateCart}
                        sx={{ height: '55px' }}
                        size="large"
                        variant="contained"
                        startIcon={<AddShoppingCartIcon />}
                      >
                        {item ? 'カートの更新' : '商品の追加'}
                      </Button>
                    </LoadingButton>
                  </Grid> */}
          {/*  );
              } else {
                return null;
              }
            })} */}
        </Grid>
      </Grid>
    </Grid>
    //  )}
  );
};

export default ProductDetails;
