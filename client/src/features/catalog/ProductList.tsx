import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import React from 'react'
import { Product } from '../../product';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
}

const ProductList = ({products}: Props) => {
  return (
    <div>
      <List>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </List>
    </div>
  )
}

export default ProductList