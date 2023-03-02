import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Product } from '../../product';
import { Typography } from '@mui/material';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
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
      <Typography variant="h2">{product.name}</Typography>
    </div>
  );
};

export default ProductDetails;
