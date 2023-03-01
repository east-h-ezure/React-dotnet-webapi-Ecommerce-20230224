import { AppBar, Toolbar, Typography } from '@mui/material'
import React from 'react'


const Header = () => {
  return (
    <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            本の森
          </Typography>
        </Toolbar>
      </AppBar>
  )
}

export default Header