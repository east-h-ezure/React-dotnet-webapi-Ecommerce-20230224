import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Product } from '../../product';
import {
  Button,
  Divider,
  Grid,
  IconButton,
  Input,
  TableBody,
  tableBodyClasses,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Favorite, Remove } from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

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
  const [quantity, setQuantity] = useState<any>(1);
  useEffect(() => {
    axios
      .get(`https://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);
  if (loading) return <h3>Loading...</h3>;
  if (!product) return <h3>商品が見つかりません</h3>;
  return (
    <div>
      <Grid container spacing={6} sx={{ mt: 0.5 }}>
        <Grid item xs={4}>
          <img
            src={product.pictureUrl}
            alt={product.name}
            style={{ width: '100%', position: 'relative' }}
          />
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
                    著者
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
              <TableRow>
                <TableCell>
                  <StyledTypography fontWeight="fontWeightBold">
                    出版社
                  </StyledTypography>
                </TableCell>
                <TableCell>
                  <StyledTypography>{product.publisher}</StyledTypography>
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
          <Grid sx={{ mt: 4, mb: 2 }} container>
            <Grid item xs={5}>
              <IconButton onClick={() => setQuantity(quantity - 1)}>
                <Remove />
              </IconButton>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                inputProps={{
                  style: {
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                  },
                  min: 1,
                }}
                sx={{ mx: 1 }}
              />
              <IconButton onClick={() => setQuantity(quantity + 1)}>
                <Add />
              </IconButton>
            </Grid>
          </Grid>
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
            <Grid item xs={4}>
              <Button
                size="large"
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
              >
                カートに追加
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductDetails;
