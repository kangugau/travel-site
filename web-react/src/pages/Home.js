import React from 'react'
import HomeMenu from '../components/Home/HomeMenu'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { Box, Grid, Typography } from '@material-ui/core'

export default function Home() {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 240,
    },
    popularCity: {
      '&--title': {},
    },
    gridList: {
      flexWrap: 'nowrap',
      overflowX: 'auto',
    },
    gridItem: {
      flexShrink: 0,
      '& img': {
        width: '100%',
        height: 'auto',
      },
    },
  }))
  const classes = useStyles()

  const tileData = [
    {
      img: 1,
      title: 'Image',
      author: 'author',
    },
    {
      img: 1,
      title: 'Image',
      author: 'author',
    },
    {
      img: 1,
      title: 'Image',
      author: 'author',
    },
    {
      img: 1,
      title: 'Image',
      author: 'author',
    },
    {
      img: 1,
      title: 'Image',
      author: 'author',
    },
  ]
  return (
    <React.Fragment>
      <HomeMenu></HomeMenu>
      <Box py={3}>
        <Typography variant="h6">Tìm kiếm gần đây</Typography>
      </Box>
      <Box py={3}>
        <Typography variant="h6">Thành phố hàng đầu</Typography>
        <Grid container className={classes.gridList} spacing={2}>
          {tileData.map((tile, index) => (
            <Grid item key={index} xs={5} sm={3} className={classes.gridItem}>
              <Link to={'/city/' + index}>
                <img src={'img/default-image.png'} alt={tile.title} />
                <div>Name</div>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box py={3}>
        <Typography variant="h6">Điểm đến hàng đầu</Typography>
        <Grid container className={classes.gridList} spacing={2}>
          {tileData.map((tile, index) => (
            <Grid item key={index} xs={5} sm={3} className={classes.gridItem}>
              <Link to={'/attraction/' + index}>
                <img src={'img/default-image.png'} alt={tile.title} />
                <div>Name</div>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </React.Fragment>
  )
}
