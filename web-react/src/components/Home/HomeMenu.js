import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

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
      backgroundColor: theme.palette.info.main,
      padding: theme.spacing(3),
    },
    pageTitle: {
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.palette.getContrastText(theme.palette.info.main),
    },
  }))
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
        <Typography variant="h1" className={classes.pageTitle}>
          Tìm kiếm những điểm đến phù hợp
        </Typography>
      </Box>
    </React.Fragment>
  )
}
