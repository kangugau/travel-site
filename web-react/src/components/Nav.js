import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Icon,
  Hidden,
  Drawer,
} from '@material-ui/core'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    justifyContent: 'space-between',
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    '@media only screen and (max-width: 600px)': {
      flexGrow: 'unset',
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#ffffff',
  },
  title: {
    color: '#000000',
  },
  drawer: {
    width: '300px',
    maxWidth: '90vw',
  },
  appBarImage: {
    maxHeight: '50px',
    paddingRight: '20px',
  },
  button: {
    marginLeft: theme.spacing(1),
  },
}))

export default function Nav() {
  const [open, setOpen] = useState(false)
  const classes = useStyles()
  return (
    <React.Fragment>
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          <Hidden smUp>
            <IconButton onClick={() => setOpen(true)}>
              <Icon>menu</Icon>
            </IconButton>
          </Hidden>
          <Box className={classes.toolbarLeft}>
            <img
              className={classes.appBarImage}
              src="img/grandstack.png"
              alt="GRANDstack logo"
            />
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            ></Typography>
          </Box>
          <Box>
            <Hidden xsDown>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
              >
                Đăng ký
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
              >
                Đăng nhập
              </Button>
            </Hidden>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box className={classes.drawer}>
          <div>
            <Button className={classes.button} variant="text" color="primary">
              Đăng ký
            </Button>
          </div>
          <div>
            <Button className={classes.button} variant="text" color="primary">
              Đăng nhập
            </Button>
          </div>
        </Box>
      </Drawer>
    </React.Fragment>
  )
}
