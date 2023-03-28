import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  Box,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { styled } from '@mui/material/styles';
import { CSSObject } from '@mui/system';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart } from '@mui/icons-material';
// import agent from '../api/agent';
import Loading from './Loading';
import { BasketItem } from '../models/basket';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../store/configureStore.1';

// スタイルの定義
const drawerWidth = 240;

const AppContainer = styled('div')({
  display: 'flex',
});

const drawerStyles = (theme: any): CSSObject => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

const ContentContainer = styled('div')({
  flexGrow: 1,
  padding: '20px',
  height: '100px',
});
const rightLinks = [
  { title: 'LOGIN', path: '/login' },
  { title: '登録', path: '/register' },
];

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

const Header = ({ handleThemeChange, darkMode }: Props) => {
  const { basket } = useAppSelector((state) => state.basket);
  // const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const rightMenu = {
    color: 'inherit',
    textDecoration: 'none',
    typography: 'subtitle1',
    '&:hover': {
      color: 'grey.500',
    },
    '&.active': {
      color: 'text.secondary',
    },
  };
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  // const [basketId, setBasketId] = useState<string>(
  //   'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21'
  // );
  const [basketId, setBasketId] = useState<number>(1);

  // useEffect(() => {
  //   const fetchBasketItems = async () => {
  //     const response = await axios.get(
  //       `https://localhost:5000/api/BasketItem?basketId=${basketId}`
  //     );
  //     setBasketItems(response.data);
  //     setLoading(false);
  //   };
  //   fetchBasketItems();
  // }, [basketId]);

  //カートの商品数
  const [totalItemCount, setTotalItemCount] = useState(0);
  // useEffect(() => {
  //   let count = 0;
  //   basket?.forEach((item) => {
  //     count += item.quantity;
  //   });
  //   setTotalItemCount(count);
  // }, [basket]);
  console.log('basket', basket);

  // if (loading) return <Loading />;

  return (
    <AppContainer>
      <AppBar position="static" sx={{ height: '70px' }}>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            sx={{ ml: 3 }}
            variant="h5"
            noWrap
            component={NavLink}
            to="/"
          >
            B-LUXE
          </Typography>
          <Switch checked={darkMode} onChange={handleThemeChange} />
          <div style={{ flexGrow: 1 }}></div>
          <Box sx={{ display: 'flex' }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              component={Link}
              to="basket"
            >
              <Badge badgeContent={totalItemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <List sx={{ display: 'flex' }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem key={path} sx={rightMenu}>
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        anchor="left"
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        sx={drawerStyles}
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItem>
            <ListItemIcon>
              <InboxIcon />
              <Typography component={NavLink} to="/">
                メニュー
              </Typography>
            </ListItemIcon>
            <ListItemText />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <InboxIcon />
              <Typography component={NavLink} to="/home">
                Home
              </Typography>
            </ListItemIcon>
            <ListItemText />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <InboxIcon />
              <Typography component={NavLink} to="/contact">
                問合せ
              </Typography>
            </ListItemIcon>
            <ListItemText />
          </ListItem>
        </List>
      </Drawer>
    </AppContainer>
  );
};

export default Header;
