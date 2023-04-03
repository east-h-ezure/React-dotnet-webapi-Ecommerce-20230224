export interface Product {
  find(arg0: (i: any) => boolean): unknown;
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
  brand: string;
  pictureUrl: string;
  quantityInStock: number;
  //publisher: string;
}

export interface ProductParams {
  sort: string;
  search?: string;
  types: string[];
  brands: string[];
  page: number;
  pageSize: number;
}

{
  /* <Grid container spacing={6} sx={{ mt: 0.5 }}>
        <Grid item xs={4}>
          <Box display="flex" alignItems="right">
            <img
              src={product.pictureUrl}
              // src="images/products/snow-coat.jpg"
              alt={product.name}
              // style={{ width: '100%', position: 'relative' }}
            />
          </Box>
          <ImageList
            sx={{ width: 500, height: 450 }}
            variant="quilted"
            cols={4}
            rowHeight={121}
          >
            <ImageListItem key={product.pictureUrl} cols={1} rows={1}>
              <img
                // {...srcset(product.pictureUrl, 121, 1, 1)}
                src={product.pictureUrl}
                alt={product.name}
                loading="lazy"
              />
            </ImageListItem>
          </ImageList>
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
                    ブランド
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
            </Grid> */
}
{
  /* {basketItem.map((item) => {
              if (item.product.id === product.id) {
                return (
                  <Grid item xs={4}>
                    {/* onClick={() => setQuantity(quantity + 1)} */
}
{
  /* <TextField
                      onChange={handleInputChage}
                      variant="outlined"
                      type="number"
                      //label="quantity in cart"
                      fullWidth
                      value={quantity}
                    />
                    <Button
                      // loading={status.loading}
                      onClick={() => setQuantity(quantity - 1)}
                    >
                      <RemoveIcon
                        sx={{ marginRight: 1, paddingTop: 1 }}
                        color="error"
                      />
                    </Button>
                    {quantity}
                    <LoadingButton
                      // loading={status.loading}
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <AddIcon sx={{ marginLeft: 1, paddingTop: 1 }} />
                    </LoadingButton>
                    <LoadingButton>
                      <Button
                        //onClick={() => handleUpdateCart}
                        sx={{ height: '55px' }}
                        size="large"
                        variant="contained"
                        startIcon={<AddShoppingCartIcon />}
                      >
                        {item ? 'カートの更新' : '商品の追加'}
                      </Button>
                    </LoadingButton>
                  </Grid> */
}
{
  /*  );
              } else {
                return null;
              }
            })} */
}
{
  /* </Grid>
        </Grid>
      </Grid> */
}
{
  /* )} */
}
