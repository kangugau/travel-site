import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, Avatar, Divider } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'

import moment from 'moment'
const useStyles = makeStyles((theme) => ({
  username: { fontWeight: 'bold' },
  reviewProp: {
    fontWeight: 500,
  },
  reviewDate: { color: theme.palette.grey[600] },
}))
export function ReviewItem(props) {
  const classes = useStyles()
  return (
    <React.Fragment>
      <Divider></Divider>
      <Box my={3}>
        <Box display="flex">
          <Avatar
            alt={props.review.owner.displayName}
            src={props.review.owner.avatar?.url}
          ></Avatar>
          <Box ml={2}>
            <div className={classes.username}>
              {props.review.owner.displayName}
            </div>
            <div className={classes.reviewDate}>
              {'Đánh giá vào ngày ' +
                moment(props.review.publishedDate.formatted).format(
                  'Do MMMM, YYYY'
                )}
            </div>
          </Box>
        </Box>
        <Box pt={2}>
          <Rating readOnly value={props.review.rating}></Rating>
        </Box>
        <Box pt={1}>
          <Typography variant="h6">{props.review.title}</Typography>
        </Box>
        <Box pt={1}>
          <span>{props.review.text}</span>
        </Box>
        <Box pt={1}>
          <span className={classes.reviewProp}>Ngày trải nghiệm: </span>
          <span>
            {moment(props.review.tripDate.formatted).format('Do MMMM, YYYY')}
          </span>
        </Box>
      </Box>
    </React.Fragment>
  )
}
