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
import { Product } from '../../product';

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <div>
      {/* <ListItem key={product.id}>
            <ListItemAvatar>
              <Avatar src={product.pictureUrl} />
            </ListItemAvatar>
            <ListItemText>
              {product.name} - {product.price}円
            </ListItemText>
          </ListItem> */}
      <Card sx={{ maxWidth: 345, flexWrap: 'wrap' }}>
        {/* <CardHeader title={product.name} /> */}
        <CardMedia
          sx={{ height: 140, backgroundSize: 'contain', bgcolor: '#f5f5f5' }}
          image={product.pictureUrl}
          title={product.pictureUrl}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold' }}>
            {product.name}
          </Typography>
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
          <Button size="small">詳細</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default ProductCard;
