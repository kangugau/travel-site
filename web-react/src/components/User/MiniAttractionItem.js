import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Paper, Grid } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import { imageContainer, attractionRating } from '../../styles'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  attraction: {
    padding: theme.spacing(0.5),
    maxWidth: '400px',
  },
  attractionImg: {
    width: '100%',
  },
  imageContainer,
  attractionRating,
  spaceTop: {
    marginTop: theme.spacing(0.5),
  },
}))
export default function MiniAttractionItem(props) {
  const classes = useStyles()
  return (
    <Paper variant="outlined" className={classes.attraction}>
      <Grid container className={classes.gridContainer} spacing={1}>
        <Grid item xs={5}>
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
        <Grid item xs={7}>
          <Link to={'/attraction/' + props.attraction.id}>
            <Typography variant="subtitle2">{props.attraction.name}</Typography>
          </Link>
          <Link
            to={'/attraction/' + props.attraction.id}
            className={clsx(classes.attractionRating, classes.spaceTop)}
          >
            <Rating
              size="small"
              value={props.attraction.avgRating}
              precision={0.1}
              readOnly
            />
            <Typography variant="caption" component="span">
              {props.attraction.totalRating} đánh giá
            </Typography>
          </Link>
          <Typography variant="caption" component="span">
            {props.attraction.city.name}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}
