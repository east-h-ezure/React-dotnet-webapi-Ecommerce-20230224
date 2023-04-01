import { Product, ProductParams } from '../../app/models/product';
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
import {
  useAppDispatch,
  useAppSelector,
} from '../../app/store/configureStore.1';
import { BrandingWatermarkSharp } from '@mui/icons-material';
import {
  fetchFilters,
  fetchProductsAsync,
  productSelectors,
} from './catalogSlice';
import Loading from '../../app/layout/Loading';

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brandTypes, setBrandTypes] = useState({ brands: [], types: [] });
  // const {productLoaded, status, filterLoaded, brands, types} = useAppSelector(state => state.catalog);
  const sortOptions = [
    { value: '', label: 'アルファベット順' },
    { value: 'price_desc', label: '高い順' },
    { value: 'price_asc', label: '低い順' },
  ];
  const [sort, setSort] = useState<string>('price_desc');
  const [search, setSearch] = useState<string>('シャツ');
  const [page] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSort(event.target.value);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  console.log('sortOptions', sortOptions);

  const productsRedux = useAppSelector(productSelectors.selectAll);
  const { status, filtersLoaded, productsLoaded } = useAppSelector(
    (state) => state.catalog
  );
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   if (!productsLoaded) dispatch(fetchProductsAsync());
  //   if (!filtersLoaded) dispatch(fetchFilters());
  // }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFilters());
  }, [dispatch, filtersLoaded]);

  useEffect(() => {
    try {
      fetch(
        `https://localhost:5000/api/products?sort=${sort}&search=${search}&page=${page}&pageSize=${pageSize}`,
        { mode: 'cors' }
      )
        .then((response) => response.json())
        .then((data) => setProducts(data));
    } catch (error) {
      console.error(error); // エラーが発生した行を特定するために、コンソールにエラーを出力する
    }
  }, [sort, search, page, pageSize]); // searchパラメーターを含めるため、依存リストにsearchを追加する
  console.log('products', products);

  useEffect(() => {
    try {
      fetch('https://localhost:5000/api/Products/brand-types', { mode: 'cors' })
        .then((response) => response.json())
        .then((data) => setBrandTypes(data));
    } catch (error) {
      console.error(error); // エラーが発生した行を特定するために、コンソールにエラーを出力する
    }
  }, []); // searchパラメーターを含めるため、依存リストにsearchを追加する
  console.log('products', products);
  console.log('brandTypes', brandTypes);

  if (status.includes('pending'))
    return <Loading message="Loading products..." />;

  return (
    <Grid container spacing={4} sx={{ mt: 3 }}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <TextField
            label="商品を検索"
            variant="outlined"
            fullWidth
            value={search}
            onChange={handleSearchChange}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">価格</FormLabel>
            <RadioGroup value={sort} onChange={handleSortChange}>
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
            {brandTypes.brands.map((brand) => (
              <FormControlLabel control={<Checkbox />} label={brand} />
            ))}
          </FormGroup>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormGroup>
            {brandTypes.types.map((type) => (
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label={type}
              />
            ))}
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
            <Pagination size="large" count={10} />
            <Pagination count={10} color="primary" size="large" />
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Catalog;
