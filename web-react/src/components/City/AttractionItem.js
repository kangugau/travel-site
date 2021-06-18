import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Paper, Grid } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import { imageContainer, attractionRating } from '../../styles'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  attraction: {
    padding: theme.spacing(1),
    '&:hover': {
      boxShadow: theme.shadows[3],
    },
  },
  attractionImg: {
    width: '100%',
  },
  imageContainer,
  attractionRating,
}))
export default function AttractionItem(props) {
  const classes = useStyles()
  return (
    <Paper variant="outlined" className={classes.attraction}>
      <Grid container className={classes.gridContainer} spacing={1}>
        <Grid item xs={12} sm={4}>
          <Link to={'/attraction/' + props.attraction.id}>
            <div className={classes.imageContainer}>
              <img
                src={
                  props.attraction.thumbnail?.url || '/img/default-image.png'
                }
                alt={props.attraction.name}
                className={classes.attractionImg}
              ></img>
            </div>
          </Link>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography>{props.attraction.categories[0].name}</Typography>
          <Link to={'/attraction/' + props.attraction.id}>
            <Typography variant="h4" component="h3">
              {props.attraction.name}
            </Typography>
          </Link>
          <Link
            to={'/attraction/' + props.attraction.id}
            className={classes.attractionRating}
          >
            <Rating
              value={props.attraction.avgRating}
              precision={0.1}
              readOnly
            />
            <Typography component="span">
              {props.attraction.totalRating} đánh giá
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Paper>
  )
}
