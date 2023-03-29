import { Product } from '../../app/models/product';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ProductList from './ProductList';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/store/configureStore.1';
import { BrandingWatermarkSharp } from '@mui/icons-material';

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  // const {productLoaded, status, filterLoaded, brands, types} = useAppSelector(state => state.catalog);
  const sortOptions = [
    { value: 'name', label: 'アルファベット順' },
    { value: '高い順', label: '高い順' },
    { value: '低い順', label: '低い順' },
  ];

  console.log('sortOptions', sortOptions);

  useEffect(() => {
    try {
      fetch('https://localhost:5000/api/products', { mode: 'cors' })
        .then((response) => response.json())
        .then((data) => setProducts(data));
    } catch (error) {
      console.error(error); // エラーが発生した行を特定するために、コンソールにエラーを出力する
    }
  }, []);
  console.log('products', products);

  return (
    <Grid container spacing={4} sx={{ mt: 3 }}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <TextField label="商品を検索" variant="outlined" fullWidth />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">価格</FormLabel>
            <RadioGroup>
              {sortOptions.map((sort) => (
                <div>
                  <FormControlLabel
                    value={sort.value}
                    control={<Radio />}
                    label={sort.label}
                  />
                </div>
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormGroup>
            {/* {brands.map(brand => (
               <FormControlLabel
               control={<Checkbox defaultChecked />}
               label={brand} key={brand}
             />
            ))} */}
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Label"
            />
          </FormGroup>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormGroup>
            {/* {types.map(brand => (
               <FormControlLabel
               control={<Checkbox defaultChecked />}
               label={type} key={label}
             />
            ))} */}
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Label"
            />
          </FormGroup>
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>1-6 of 20 items</Typography>
          <Stack spacing={2}>
            <Pagination count={10} />
            <Pagination count={10} color="primary" />
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Catalog;
