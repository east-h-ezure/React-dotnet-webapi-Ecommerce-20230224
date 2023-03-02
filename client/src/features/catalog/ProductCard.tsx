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
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Product } from '../../product';
import { styled } from '@mui/system';

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
          <Button size="small">カートに追加</Button>
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
