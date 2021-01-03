import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, Paper, Avatar } from '@material-ui/core'
import moment from 'moment'

import Rating from '@material-ui/lab/Rating'
import { useQuery, gql } from '@apollo/client'
import { attractionRating, imageContainer } from '../../styles'

const GET_ATTRACTION_REVIEWS = gql`
  query getAttractionReviews(
    $first: Int = 10
    $offset: Int
    $orderBy: [_ReviewOrdering]
    $filter: _ReviewFilter
  ) {
    reviews: Review(
      first: $first
      offset: $offset
      orderBy: $orderBy
      filter: $filter
    ) {
      id
      createdDate {
        formatted
      }
      publishedDate {
        formatted
      }
      title
      text
      rating
      tripDate {
        formatted
      }
      tripType
      owner {
        id
        displayName
      }
      photos {
        ...Photo
      }
    }
  }
  fragment Photo on Photo {
    width
    height
    url
  }
`
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  title: {
    fontWeight: '500',
  },
  commentBlock: {
    padding: theme.spacing(2),
  },
  icon: {
    marginRight: '4px',
  },
  ratingLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  ratingBar: {
    display: 'inline-block',
    width: '80px',
    height: '0.5rem',
    marginRight: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
  },
  username: { fontWeight: 'bold' },
  reviewDate: { color: theme.palette.grey[600] },
  imageContainer,
  attractionRating,
}))

export default function Reviews(props) {
  const classes = useStyles()
  let { data: reviewsData } = useQuery(GET_ATTRACTION_REVIEWS, {
    variables: { filter: { attraction: { id: props.attractionId } } },
  })
  return (
    <React.Fragment>
      {reviewsData &&
        reviewsData.reviews.map((review) => {
          return (
            <Box key={review.id} my={2}>
              <Paper elevation={0} className={classes.commentBlock}>
                <Box display="flex">
                  <Avatar
                    alt={review.owner.displayName}
                    src={review.owner.avatar?.url}
                  ></Avatar>
                  <Box ml={2}>
                    <div className={classes.username}>
                      {review.owner.displayName}
                    </div>
                    <div className={classes.reviewDate}>
                      {'Đánh giá vào ngày ' +
                        moment(review.publishedDate.formatted).format(
                          'Do MMMM, YYYY'
                        )}
                    </div>
                  </Box>
                </Box>
                <Box pt={2}>
                  <Rating readOnly value={review.rating}></Rating>
                </Box>
                <Box pt={1}>
                  <Typography variant="h6">{review.title}</Typography>
                </Box>
                <Box pt={1}>
                  <span>{review.text}</span>
                </Box>
              </Paper>
            </Box>
          )
        })}
    </React.Fragment>
  )
}
