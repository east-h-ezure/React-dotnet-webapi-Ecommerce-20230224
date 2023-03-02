import { useState } from 'react';
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
import { Link } from 'react-router-dom';
import { ShoppingCart } from '@mui/icons-material';

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
          <Typography sx={{ ml: 3 }} variant="h5" noWrap>
            本の森
          </Typography>
          <Switch checked={darkMode} onChange={handleThemeChange} />
          <div style={{ flexGrow: 1 }}></div>
          <Box sx={{ display: 'flex' }}>
            <IconButton size="large" edge="start" color="inherit">
              <Badge badgeContent="4" color="secondary">
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
              <Link to="/">メニュー</Link>
            </ListItemIcon>
            <ListItemText />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <InboxIcon />
              <Link to="/home">Home</Link>
            </ListItemIcon>
            <ListItemText />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <InboxIcon />
              <Link to="/contact">問合せ</Link>
            </ListItemIcon>
            <ListItemText />
          </ListItem>
        </List>
      </Drawer>
    </AppContainer>
  );
};

export default Header;
