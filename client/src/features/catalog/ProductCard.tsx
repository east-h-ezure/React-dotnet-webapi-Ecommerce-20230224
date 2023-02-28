import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import React from 'react'
import { Product } from '../../product';

interface Props {
  product: Product;
}

const ProductCard = ({product}: Props) => {
  return (
    <div>
      <ListItem key={product.id}>
            <ListItemAvatar>
              <Avatar src={product.pictureUrl} />
            </ListItemAvatar>
            <ListItemText>
              {product.name} - {product.price}円
            </ListItemText>
          </ListItem>
    </div>
  )
}

export default ProductCard