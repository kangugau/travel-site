import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  Box,
  CircularProgress,
  Backdrop,
  Grid,
} from '@material-ui/core'
import Pagination from '../components/Pagination'
import { useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router-dom'
import AttractionItem from '../components/City/AttractionItem'
import AttractionFilter from '../components/City/AttractionFilter'

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
    $first: Int = ${ATTRACTION_PER_PAGE}
    $offset: Int = 0
    $filter: _AttractionFilter
  ) {
    attractions: Attraction(
      first: $first
      offset: $offset
      filter: $filter
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
      filter: $filter
    ) {
      id
    }
  }
`
export default function City() {
  const classes = useStyles()
  const params = useParams()
  const [selectedCates, setSelectedCates] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])

  const filter = { city: { id: params.id } }
  if (selectedCates.length) {
    filter.categories_some = {
      id_in: selectedCates,
    }
  }

  if (selectedTypes.length) {
    filter.types_some = {
      id_in: selectedTypes,
    }
  }

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
      offset: (page - 1) * ATTRACTION_PER_PAGE,
      filter: filter,
    },
  })
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
          <Grid container spacing={2}>
            <Grid item sm={12} md={4}>
              <AttractionFilter
                selectedCates={selectedCates}
                selectedTypes={selectedTypes}
                onCatesChange={setSelectedCates}
                onTypesChange={setSelectedTypes}
              ></AttractionFilter>
            </Grid>
            <Grid item sm={12} md={8}>
              {attractionsData &&
                attractionsData.attractions.map((attraction) => {
                  return (
                    <AttractionItem
                      key={attraction.id}
                      attraction={attraction}
                    ></AttractionItem>
                  )
                })}
            </Grid>
          </Grid>
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
