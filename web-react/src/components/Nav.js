import React, { useState, useContext, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Icon,
  Drawer,
  Modal,
  Backdrop,
  Fade,
  Paper,
  Avatar,
  Menu,
  MenuList,
  MenuItem,
  useMediaQuery,
} from '@material-ui/core'
import Search from './Search'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { deepOrange } from '@material-ui/core/colors'
import LoginModal from './Auth/LoginModal'
import RegisterModal from './Auth/RegisterModal'
import { Link } from 'react-router-dom'
import { useUser } from '../utils/hooks'
import { AuthModalContext } from '../contexts/AuthModalContext'

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
    width: '250px',
    maxWidth: '90vw',
    padding: theme.spacing(2),
  },
  appBarImage: {
    maxHeight: '50px',
    '@media (min-width: 600px)': {
      paddingRight: '20px',
    },
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '350px',
    maxWidth: '90vw',
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  avatar: {
    padding: theme.spacing(1),
  },
  seperator: {
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.grey[500],
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  verticalAlignMiddle: {
    verticalAlign: 'middle',
  },
  iconButton: {
    marginRight: theme.spacing(0.5),
  },
  navItem: {
    marginRight: theme.spacing(2),
  },
}))

export default function Nav() {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [searchBar, setSearchBar] = useState(false)
  const user = useUser()
  console.log('check token')
  useEffect(() => {
    if (user && user.exp < new Date().getTime() / 1000) {
      localStorage.removeItem('token')
    }
  }, [user])

  const theme = useTheme()
  const xsDown = useMediaQuery(theme.breakpoints.down('xs'))

  // auth modal
  const { modalOpen, isLoginModal, handleClose, handleOpen } = useContext(
    AuthModalContext
  )

  // profile menu
  const [anchorEl, setAnchorEl] = React.useState(null)
  const openProfileMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const closeProfileMenu = () => {
    setAnchorEl(null)
  }

  const logout = () => {
    localStorage.removeItem('token')
    closeProfileMenu()
    window.location.reload()
  }

  const authButtons = (
    <React.Fragment>
      <div>
        <Button
          className={classes.button}
          variant={xsDown ? 'contained' : 'text'}
          fullWidth={xsDown}
          color="primary"
          onClick={() => handleOpen(false)}
        >
          Đăng ký
        </Button>
      </div>
      <div>
        <Button
          className={classes.button}
          variant={xsDown ? 'contained' : 'text'}
          fullWidth={xsDown}
          color="primary"
          onClick={() => handleOpen(true)}
        >
          Đăng nhập
        </Button>
      </div>
    </React.Fragment>
  )
  return (
    <React.Fragment>
      <AppBar position="fixed" className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          {xsDown && !searchBar && (
            <IconButton onClick={() => setOpen(true)}>
              <Icon>menu</Icon>
            </IconButton>
          )}
          {xsDown && searchBar && (
            <IconButton
              onClick={() => {
                setSearchBar(false)
              }}
            >
              <Icon>arrow_back</Icon>
            </IconButton>
          )}
          <Box className={classes.toolbarLeft}>
            {(!xsDown || (xsDown && !searchBar)) && (
              <Link to="/">
                <img
                  className={classes.appBarImage}
                  src="/img/logo.svg"
                  alt="Attraction Finder logo"
                />
              </Link>
            )}
            {(!xsDown || searchBar) && <Search></Search>}
          </Box>
          {!xsDown && (
            <React.Fragment>
              <Button
                variant="contained"
                className={classes.navItem}
                color="primary"
              >
                <Icon className={classes.iconButton}>bookmarks</Icon>Đã lưu
              </Button>
            </React.Fragment>
          )}

          <Box display="flex">
            {!xsDown ? (
              !user ? (
                authButtons
              ) : (
                <React.Fragment>
                  <IconButton
                    className={classes.avatar}
                    onClick={openProfileMenu}
                  >
                    <Avatar className={classes.orange}>
                      {user.username[0]}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    getContentAnchorEl={null}
                    open={Boolean(anchorEl)}
                    onClose={closeProfileMenu}
                  >
                    <MenuItem onClick={closeProfileMenu}>Profile</MenuItem>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                  </Menu>
                </React.Fragment>
              )
            ) : (
              <IconButton
                onClick={() => {
                  setSearchBar(true)
                }}
              >
                <Icon>search</Icon>
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box className={classes.drawer}>
          {!user ? (
            authButtons
          ) : (
            <React.Fragment>
              <Box p={1}>
                <Link to={`/user/${user.id}`}>
                  <IconButton className={classes.avatar}>
                    <Avatar className={classes.orange}>
                      {user.username[0]}
                    </Avatar>
                  </IconButton>
                  <Typography
                    variant="h5"
                    component="span"
                    className={classes.verticalAlignMiddle}
                  >
                    {user.username}
                  </Typography>
                </Link>
              </Box>
              <div className={classes.seperator} />
              <MenuList>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </MenuList>
            </React.Fragment>
          )}
        </Box>
      </Drawer>
      <Modal
        className={classes.modal}
        open={modalOpen}
        onClose={handleClose}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <Paper className={classes.modalContent} elevation={3}>
            <img src="/img/logo.svg" alt="GRANDstack logo" />
            <Typography variant="h4" id="transition-modal-title">
              {isLoginModal ? 'Đăng nhập' : 'Đăng ký'}
            </Typography>
            {isLoginModal ? (
              <LoginModal
                handleOpen={handleOpen}
                handleClose={handleClose}
              ></LoginModal>
            ) : (
              <RegisterModal
                handleOpen={handleOpen}
                handleClose={handleClose}
              ></RegisterModal>
            )}
          </Paper>
        </Fade>
      </Modal>
    </React.Fragment>
  )
}
