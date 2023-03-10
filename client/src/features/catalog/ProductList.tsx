import {
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { Product } from '../../product';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
}

const ProductList = ({ products }: Props) => {
  return (
    <div>
      <Grid container spacing={4} sx={{ mt: 3 }}>
        {products.map((product) => (
          <Grid item key={product.id} xs={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductList;
