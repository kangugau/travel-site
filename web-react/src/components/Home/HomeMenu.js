import React from 'react'
import {
  // Button,
  Icon,
  Box,
  TextField,
  InputAdornment,
  Paper,
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'

export default function HomeMenu() {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      overflow: 'auto',
      margin: 'auto',
      '@media only screen and (max-width: 600px)': {
        justifyContent: 'flex-start',
      },
    },
    menuButton: {
      minWidth: '150px',
    },
    search: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '300px',
      borderRadius: '0.5rem',
      backgroundColor: theme.palette.info.light,
    },
  }))
  const MenuIcon = withStyles(() => ({
    root: {
      marginRight: '0.5rem',
    },
  }))(Icon)
  const classes = useStyles()
  return (
    <React.Fragment>
      {/* <Box className={classes.root}>
        <Button
          className={classes.menuButton}
          variant="outlined"
          color="primary"
          size="large"
        >
          <MenuIcon>explore</MenuIcon>
          Địa điểm
        </Button>
        <Button
          className={classes.menuButton}
          variant="outlined"
          color="primary"
          size="large"
        >
          <MenuIcon>hotel</MenuIcon>
          Khách sạn
        </Button>
        <Button
          className={classes.menuButton}
          variant="outlined"
          color="primary"
          size="large"
        >
          <MenuIcon>restaurant</MenuIcon>
          Nhà hàng
        </Button>
      </Box> */}
      <Box className={classes.search}>
        <Paper>
          <TextField
            variant="outlined"
            InputProps={{
              placeholder: 'Tìm kiếm địa điểm',
              startAdornment: (
                <InputAdornment position="start">
                  <MenuIcon>search</MenuIcon>
                </InputAdornment>
              ),
            }}
          ></TextField>
        </Paper>
      </Box>
    </React.Fragment>
  )
}
