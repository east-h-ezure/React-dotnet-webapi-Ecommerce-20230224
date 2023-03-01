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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { styled } from '@mui/material/styles';
import { CSSObject } from '@mui/system';

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
  height: '50px',
});
interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

const Header = ({ handleThemeChange, darkMode }: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <AppContainer>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 0 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography sx={{ ml: 3 }} variant="h5" noWrap>
            本の森
          </Typography>
          <Switch
            sx={{ ml: 6 }}
            checked={darkMode}
            onChange={handleThemeChange}
          />
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
          {['トップ', '商品', '検索', '問合せ'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppContainer>
  );
};

export default Header;
