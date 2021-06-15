import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { Box, Grid, Typography } from '@material-ui/core'
import { imageContainer } from '../../styles/image'
import { Rating } from '@material-ui/lab'
import { attractionRating } from '../../styles'
import BookmarkButton from '../Attraction/BookmarkButton'

const useStyles = makeStyles((theme) => ({
  gridItem: {
    flexShrink: 0,
    position: 'relative',
  },
  bookmarkButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: '#fff',
    zIndex: '1',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.8)',
    },
  },
  imageContainer,
  attractionRating,
}))

export default function Home(props) {
  const classes = useStyles()
  const {
    attraction,
    userInfo,
    onBookmarkChange,
    xs = 8,
    sm = 4,
    lg = 3,
  } = props

  return (
    <Grid
      item
      key={attraction.id}
      xs={xs}
      sm={sm}
      lg={lg}
      className={classes.gridItem}
    >
      <BookmarkButton
        size="small"
        userInfo={userInfo}
        attractionId={attraction.id}
        className={classes.bookmarkButton}
        onBookmarkChange={onBookmarkChange}
      ></BookmarkButton>
      <Link to={'/attraction/' + attraction.id}>
        <div className={classes.imageContainer}>
          <img
            src={attraction.thumbnail?.url || '/img/default-image.png'}
            alt={attraction.name}
          />
        </div>
        <Box mt={0.5} mb={1}>
          <div>{attraction.name}</div>
          <div className={classes.attractionRating}>
            <Rating value={attraction.avgRating} precision={0.1} readOnly />
            <Typography component="span">
              {attraction.totalRating} đánh giá
            </Typography>
          </div>
        </Box>
      </Link>
    </Grid>
  )
}
