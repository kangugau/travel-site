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
import Search from '../Search'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import navCss from './Nav.css'
import LoginModal from '../Auth/LoginModal'
import RegisterModal from '../Auth/RegisterModal'
import { Link } from 'react-router-dom'
import { useUser } from '../../utils/hooks'
import { AuthContext } from '../../contexts/AuthContext'

const useStyles = makeStyles(navCss)

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

  const isAdmin = user && user.roles?.includes('ADMIN')
  const theme = useTheme()
  const xsDown = useMediaQuery(theme.breakpoints.down('xs'))

  // auth modal
  const { modalOpen, isLoginModal, handleClose, handleOpen } = useContext(
    AuthContext
  )

  // profile menu
  const [anchorEl, setAnchorEl] = React.useState(null)
  const openProfileMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const closeProfileMenu = () => {
    setAnchorEl(null)
  }

  // admin menu
  const [adminAnchorEl, setAdminAnchorEl] = React.useState(null)
  const openAdminMenu = (event) => {
    setAdminAnchorEl(event.currentTarget)
  }
  const closeAdminMenu = () => {
    setAdminAnchorEl(null)
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
              {isAdmin && (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    variant="outlined"
                    className={classes.navItem}
                    onClick={openAdminMenu}
                  >
                    <Icon className={classes.iconButton}>
                      admin_panel_settings
                    </Icon>
                    Admin menu
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={adminAnchorEl}
                    keepMounted
                    open={Boolean(adminAnchorEl)}
                    onClose={closeAdminMenu}
                  >
                    <MenuItem onClick={closeAdminMenu}>
                      <Link to="/attraction/add">
                        <Icon className={classes.iconButton}>add_location</Icon>
                        Thêm địa điểm mới
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={closeAdminMenu}>
                      <Link to="/category">
                        <Icon className={classes.iconButton}>category</Icon>
                        Quản lý danh mục
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={closeAdminMenu}>
                      <Link to="/type">
                        <Icon className={classes.iconButton}>museum</Icon>
                        Quản lý thể loại
                      </Link>
                    </MenuItem>
                  </Menu>
                </>
              )}
              {/* <Button
                variant="outlined"
                className={classes.navItem}
                color="primary"
              >
                <Icon className={classes.iconButton}>bookmarks</Icon>Đã lưu
              </Button> */}
            </React.Fragment>
          )}

          <Box display="flex" alignItems="center">
            {!xsDown ? (
              !user ? (
                authButtons
              ) : (
                <React.Fragment>
                  <Button className={classes.avatar} onClick={openProfileMenu}>
                    <Avatar className={classes.orange}></Avatar>
                    <Typography
                      variant="h6"
                      component="span"
                      className={classes.displayName}
                    >
                      {user.displayName}
                    </Typography>
                  </Button>
                  <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    getContentAnchorEl={null}
                    open={Boolean(anchorEl)}
                    onClose={closeProfileMenu}
                  >
                    <MenuItem onClick={closeProfileMenu}>
                      <Link to={`/user/${user.id}`}>Profile</Link>
                    </MenuItem>
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
                    <Avatar className={classes.orange}></Avatar>
                  </IconButton>
                  <Typography
                    variant="h5"
                    component="span"
                    className={classes.verticalAlignMiddle}
                  >
                    {user.displayName}
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
