import React, { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  Box,
  Paper,
  Icon,
  Button,
  LinearProgress,
  Grid,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core'

import { Rating } from '@material-ui/lab'
import { useQuery, gql } from '@apollo/client'
import { attractionRating, imageContainer } from '../../styles'

import Loading from '../Loading'
import { ReviewItem } from './ReviewItem'
import { AddReview } from './AddReview'
import Pagination from '../Pagination'

import { useUser } from '../../utils/hooks'
import { AuthContext } from '../../contexts/AuthContext'

const REVIEWS_PER_PAGE = 10
const GET_ATTRACTION_REVIEWS = gql`
  query getAttractionReviews(
    $first: Int = ${REVIEWS_PER_PAGE}
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
      tripType
      owner {
        id
        displayName
      }
      photos {
        ...Photo
      }
    }
    allResults: Review(filter: $filter) {
      id
    }
  }
  fragment Photo on Photo {
    width
    height
    url
  }
`
// const GET_TOTAL_RESULTS = gql`
//   query getTotalResults($filter: _ReviewFilter) {
//     allResults: Review(filter: $filter) {
//       id
//     }
//   }
// `

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  title: {
    fontWeight: '500',
  },
  textBlock: {
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
  imageContainer,
  attractionRating,
}))

export default function Reviews(props) {
  const classes = useStyles()

  const [page, setPage] = useState(1)
  const changePage = (event, value) => {
    setPage(value)
  }

  const [ratingFilter, setRatingFilter] = useState([])

  const isChecked = (rating) => {
    return ratingFilter.indexOf(rating) != -1
  }

  const onRatingFilterChange = (rating, value) => {
    const temp = [...ratingFilter]
    if (value) {
      temp.push(rating)
    } else {
      temp.splice(temp.indexOf(rating), 1)
    }
    setPage(1)
    setRatingFilter(temp)
  }

  const filter = { attraction: { id: props.attraction.id } }
  if (ratingFilter.length) {
    filter.rating_in = ratingFilter
  }
  let { loading, data: reviewsData, refetch } = useQuery(
    GET_ATTRACTION_REVIEWS,
    {
      variables: {
        orderBy: ['publishedDate_desc'],
        offset: (page - 1) * REVIEWS_PER_PAGE,
        filter: filter,
      },
    }
  )
  const user = useUser()
  const { handleOpen } = useContext(AuthContext)
  const [modalState, setModalState] = useState(false)
  const openModal = () => {
    if (user) {
      setModalState(true)
    } else {
      handleOpen(true)
    }
  }
  const closeModal = () => {
    setModalState(false)
  }

  const onAddReview = () => {
    refetch()
  }

  const onDeleteReview = () => {
    refetch()
  }

  return (
    <React.Fragment>
      <Grid item xs={12} sm={12} md={8}>
        <Paper elevation={0} className={classes.textBlock}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h2" className={classes.title}>
              Đánh giá
            </Typography>
            <Button variant="contained" color="primary" onClick={openModal}>
              <Icon className={classes.icon}>create</Icon>
              Viết đánh giá
            </Button>
          </Box>
          <Box my={1} display="flex" alignItems="center">
            <Box textAlign="center" mr={2}>
              <Typography variant="h6">
                {props.attraction.avgRating?.toFixed(1)}
              </Typography>
              <Rating
                value={props.attraction.avgRating}
                precision={0.1}
                readOnly
                size="small"
              />
              <div>{props.attraction.totalRating} đánh giá</div>
            </Box>
            <Divider flexItem orientation="vertical"></Divider>
            <Box ml={2}>
              <FormGroup>
                {props.attraction.ratingCount.map((rating) => {
                  return (
                    <FormControlLabel
                      key={rating.rating}
                      control={
                        <Checkbox
                          color="primary"
                          checked={isChecked(rating.rating)}
                          onChange={(event, value) =>
                            onRatingFilterChange(rating.rating, value)
                          }
                        />
                      }
                      label={
                        <div className={classes.ratingLabel}>
                          <Rating value={rating.rating} readOnly size="small" />
                          <LinearProgress
                            className={classes.ratingBar}
                            variant="determinate"
                            value={
                              (rating.count * 100) /
                              props.attraction.totalRating
                            }
                          ></LinearProgress>
                          <span>{rating.count}</span>
                        </div>
                      }
                    />
                  )
                })}
              </FormGroup>
            </Box>
          </Box>
          <Box mt={3}>
            {loading && <Loading></Loading>}
            {reviewsData?.reviews && (
              <React.Fragment>
                {reviewsData.reviews.map((review) => {
                  return (
                    <ReviewItem
                      key={review.id}
                      review={review}
                      onDeleteReview={onDeleteReview}
                    />
                  )
                })}
                {reviewsData.allResults.length > 0 ? (
                  <Pagination
                    count={Math.ceil(
                      reviewsData.allResults.length / REVIEWS_PER_PAGE
                    )}
                    shape="rounded"
                    color="primary"
                    size="large"
                    page={page}
                    onChange={changePage}
                  />
                ) : (
                  <Typography align="center">Chưa có đánh giá nào</Typography>
                )}
              </React.Fragment>
            )}
          </Box>
        </Paper>
      </Grid>
      <AddReview
        attraction={props.attraction}
        modalOpen={modalState}
        handleClose={closeModal}
        onAddReview={onAddReview}
      ></AddReview>
    </React.Fragment>
  )
}
