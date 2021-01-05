import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { imageContainer, attractionRating } from '../styles'
import { Rating } from '@material-ui/lab'
import {
  Typography,
  Box,
  CircularProgress,
  Backdrop,
  Grid,
  Paper,
} from '@material-ui/core'
import Pagination from '../components/Pagination'
import { useQuery, gql } from '@apollo/client'
import { useParams, Link } from 'react-router-dom'

function roundHalf(num) {
  return Math.floor(num * 2) / 2
}

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  title: {
    fontWeight: '500',
    marginBottom: theme.spacing(4),
  },
  cityImage: {
    width: '100%',
  },
  pageHeader: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(3),
    fontWeight: '500',
    textAlign: 'center',
  },
  descTitle: {
    fontWeight: '500',
  },
  descDetail: {
    marginTop: theme.spacing(2),
  },
  attraction: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '&:hover': {
      boxShadow: theme.shadows[3],
    },
  },
  attractionImg: {
    width: '100%',
  },
  attractionRating,
  imageContainer,
}))
const ATTRACTION_PER_PAGE = 10
const GET_CITY = gql`
  query getCity($id: ID!) {
    City(id: $id) {
      id
      name
      descriptionTitle
      descriptionDetail
      descriptionAlt
      thumbnail {
        width
        height
        url
      }
    }
  }
`

const GET_ATTRACTIONS = gql`
  query getAttractions(
    $cityId: ID!
    $first: Int = ${ATTRACTION_PER_PAGE}
    $offset: Int = 0
  ) {
    attractions: Attraction(
      first: $first
      offset: $offset
      filter: { city: { id: $cityId } }
      orderBy: [totalRating_desc]
    ) {
      id
      name
      location {
        longitude
        latitude
      }
      address
      thumbnail {
        width
        height
        url
      }
      categories {
        id
        name
      }
      types {
        id
        name
      }
      avgRating
      totalRating
    }
    allResults: Attraction(
      filter: { city: { id: $cityId } }
    ) {
      id
    }
  }
`
export default function City() {
  const classes = useStyles()
  const params = useParams()
  const [page, setPage] = useState(1)
  const changePage = (event, value) => {
    setPage(value)
  }
  const { loading: cityLoading, data: cityData, error: cityError } = useQuery(
    GET_CITY,
    {
      variables: {
        id: params.id,
      },
    }
  )
  const {
    // loading: attractionsLoading,
    data: attractionsData,
    // error: attractionsError,
  } = useQuery(GET_ATTRACTIONS, {
    variables: {
      cityId: params.id,
      offset: (page - 1) * ATTRACTION_PER_PAGE,
    },
  })
  console.log(attractionsData)
  return (
    <React.Fragment>
      <Backdrop open={cityLoading}>
        <CircularProgress></CircularProgress>
      </Backdrop>
      {cityError && (
        <Typography variant="h1" className={classes.title}>
          Đã xảy ra lỗi
        </Typography>
      )}
      {cityData && (
        <Box className={classes.container}>
          <Typography variant="h1" className={classes.title}>
            {cityData.City[0].name}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <Typography variant="h4" className={classes.descTitle}>
                {cityData.City[0].descriptionTitle
                  ? cityData.City[0].descriptionTitle
                  : `Giới thiệu về ${cityData.City[0].name}`}
              </Typography>
              <Typography className={classes.descDetail}>
                {cityData.City[0].descriptionDetail
                  ? cityData.City[0].descriptionDetail
                  : cityData.City[0].descriptionAlt}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <div className={classes.imageContainer}>
                <img
                  src={cityData.City[0].thumbnail.url}
                  alt={cityData.City[0].name}
                  className={classes.cityImage}
                />
              </div>
            </Grid>
          </Grid>
          <Typography
            variant="h3"
            component="h2"
            className={classes.pageHeader}
          >
            Điểm du lịch tại {cityData.City[0].name}
          </Typography>
          <div className={classes.attractionList}>
            {attractionsData &&
              attractionsData.attractions.map((attraction) => {
                return (
                  <Paper
                    variant="outlined"
                    className={classes.attraction}
                    key={attraction.id}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Link to={'/attraction/' + attraction.id}>
                          <div className={classes.imageContainer}>
                            <img
                              src={
                                attraction.thumbnail?.url ||
                                '/img/default-image.png'
                              }
                              alt={attraction.name}
                              className={classes.attractionImg}
                            ></img>
                          </div>
                        </Link>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <Typography>{attraction.categories[0].name}</Typography>
                        <Link to={'/attraction/' + attraction.id}>
                          <Typography variant="h4" component="h3">
                            {attraction.name}
                          </Typography>
                        </Link>
                        <Link
                          to={'/attraction/' + attraction.id}
                          className={classes.attractionRating}
                        >
                          <Rating
                            value={roundHalf(attraction.avgRating)}
                            precision={0.5}
                            readOnly
                          />
                          <Typography component="span">
                            {attraction.totalRating} đánh giá
                          </Typography>
                        </Link>
                      </Grid>
                    </Grid>
                  </Paper>
                )
              })}
          </div>
          {attractionsData && (
            <Pagination
              count={Math.ceil(
                attractionsData.allResults.length / ATTRACTION_PER_PAGE
              )}
              shape="rounded"
              color="primary"
              size="large"
              page={page}
              onChange={changePage}
            />
          )}
        </Box>
      )}
    </React.Fragment>
  )
}
