import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { fontWeight } from '@mui/system';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Product } from '../../app/models/product';
import { styled } from '@mui/system';
import axios, { AxiosResponse } from 'axios';
//import { useStoreContext } from '../../app/context/StoreContext';
import { LoadingButton } from '@mui/lab';
import config from '../../app/api/config';
import { Basket, BasketItem } from '../../app/models/basket';
import {
  useAppDispatch,
  useAppSelector,
} from '../../app/store/configureStore.1';

interface Props {
  product: Product;
}

const StyledLink = styled(RouterLink)`
  text-decoration: none;
  color: black;
  &:hover {
    border: none;
    color: darkgray;
  }
`;

const ProductCard = ({ product }: Props) => {
  const dispatch = useAppDispatch();
  const { basket } = useAppSelector((state) => state.basket);

  const [loading, setLoading] = useState(false);
  const userId = 'aa';
  // const guid = 'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21';
  // const [basket, setBasket] = useState<Basket[]>([]);
  const [basketItem, setBasketItem] = useState<BasketItem[]>([]);

  const responseBody = (response: AxiosResponse) => response.data;

  const requests = {
    get: (url: string) => axios.get(config.API_URL + url).then(responseBody),
    post: (url: string, body: {}) =>
      axios.post(config.API_URL + url, body).then(responseBody),
    put: (url: string, body: {}) =>
      axios.put(config.API_URL + url, body).then(responseBody),
    del: (url: string) => axios.delete(config.API_URL + url).then(responseBody),
  };
  const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) =>
      requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) =>
      requests.del(`basket?productId=${productId}&quantity=${quantity}`),
  };

  const handleAddItem2 = async (productId: number, quantity = 1) => {
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
      setBasketItem(basket);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };
  console.log('product', product);

  return (
    <div>
      <Card sx={{ maxWidth: 345, flexWrap: 'wrap' }}>
        <RouterLink to={`/catalog/${product.id}`}>
          <CardMedia
            sx={{ height: 140, backgroundSize: 'contain', bgcolor: '#f5f5f5' }}
            image={product.pictureUrl}
            title={product.pictureUrl}
          />
        </RouterLink>
        <CardContent>
          <StyledLink to={`/catalog/${product.id}`}>
            <Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold' }}>
              {product.name}
            </Typography>
          </StyledLink>

          <Typography gutterBottom color="red" variant="h6">
            {product.price.toLocaleString('ja-JP', {
              style: 'currency',
              currency: 'JPY',
            })}
          </Typography>
          <Typography gutterBottom color="text.secondary" variant="subtitle2">
            {product.brand} 著
          </Typography>
          <Typography gutterBottom color="text.secondary" variant="subtitle2">
            {product.type}
          </Typography>
          {/* <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography> */}
        </CardContent>
        <CardActions>
          <LoadingButton
            loading={loading}
            size="small"
            onClick={() => handleAddItem2(product.id)}
          >
            カートに追加
          </LoadingButton>
          <Button
            component={StyledLink}
            to={`/catalog/${product.id}`}
            size="small"
          >
            詳細
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default ProductCard;
