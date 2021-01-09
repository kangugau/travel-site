import React, { useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Typography,
  Box,
  CircularProgress,
  Backdrop,
  Grid,
  Button,
  Icon,
  Drawer,
  useMediaQuery,
  Chip,
  IconButton,
} from '@material-ui/core'
import Pagination from '../components/Pagination'
import { useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router-dom'
import AttractionItem from '../components/City/AttractionItem'
import AttractionFilter from '../components/City/AttractionFilter'
import Loading from '../components/Loading'

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
  buttonIcon: {
    marginRight: theme.spacing(1),
  },
  filterDrawer: {
    maxWidth: '85vw',
  },
  attractionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  removeAllButton: {
    fontWeight: '500',
    textDecoration: 'underline',
    cursor: 'pointer',
    display: 'inline-block',
    paddingLeft: theme.spacing(0.5),
  },
  closeDrawerButton: {
    position: 'absolute',
    right: 0,
    top: 0,
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

  const [filterDrawer, setFilterDrawer] = useState(false)
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))

  const [selectedCates, setSelectedCates] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])

  const filter = { city: { id: params.id } }
  if (selectedCates.length) {
    filter.categories_some = {
      id_in: selectedCates.map((cate) => cate.id),
    }
  }
  const deleteCate = (id) => {
    let temp = [...selectedCates]
    temp.splice(
      temp.findIndex((cate) => cate.id === id),
      1
    )
    setSelectedCates(temp)
  }

  if (selectedTypes.length) {
    filter.types_some = {
      id_in: selectedTypes.map((type) => type.id),
    }
  }
  const deleteType = (id) => {
    let temp = [...selectedTypes]
    temp.splice(
      temp.findIndex((type) => type.id === id),
      1
    )
    setSelectedTypes(temp)
  }

  const removeAllFilter = () => {
    setSelectedCates([])
    setSelectedTypes([])
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
    loading: attractionsLoading,
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
            {!smDown && (
              <Grid item sm={12} md={4}>
                <AttractionFilter
                  selectedCates={selectedCates}
                  selectedTypes={selectedTypes}
                  onCatesChange={setSelectedCates}
                  onTypesChange={setSelectedTypes}
                ></AttractionFilter>
              </Grid>
            )}
            <Grid item sm={12} md={8} className={classes.attractionList}>
              <div>
                {' '}
                {smDown && (
                  <Box mb={1}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setFilterDrawer(true)}
                    >
                      <Icon className={classes.buttonIcon}>filter_alt</Icon>
                      Bộ lọc
                    </Button>
                  </Box>
                )}
                <Box mb={1}>
                  {selectedCates.map((cate) => (
                    <Chip
                      key={cate.id}
                      clickable
                      label={cate.name}
                      onClick={() => deleteCate(cate.id)}
                      onDelete={() => deleteCate(cate.id)}
                    />
                  ))}
                  {selectedTypes.map((type) => (
                    <Chip
                      key={type.id}
                      clickable
                      label={type.name}
                      onClick={() => deleteType(type.id)}
                      onDelete={() => deleteType(type.id)}
                    />
                  ))}
                </Box>
                {attractionsLoading && <Loading></Loading>}
                {attractionsData && (
                  <React.Fragment>
                    Tìm thấy{' '}
                    <strong>
                      {attractionsData.allResults.length} kết quả.
                    </strong>
                    {(selectedTypes.length > 0 || selectedCates.length > 0) && (
                      <span
                        className={classes.removeAllButton}
                        onClick={removeAllFilter}
                      >
                        Xóa tất cả bộ lọc
                      </span>
                    )}
                  </React.Fragment>
                )}
              </div>
              {attractionsData && (
                <React.Fragment>
                  {attractionsData.attractions.map((attraction) => {
                    return (
                      <AttractionItem
                        key={attraction.id}
                        attraction={attraction}
                      ></AttractionItem>
                    )
                  })}
                  <Pagination
                    count={Math.ceil(
                      attractionsData.allResults.length / ATTRACTION_PER_PAGE
                    )}
                    page={page}
                    onChange={changePage}
                  />
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </Box>
      )}
      <Drawer
        open={filterDrawer}
        onClose={() => setFilterDrawer(false)}
        anchor="right"
      >
        <IconButton
          className={classes.closeDrawerButton}
          onClick={() => setFilterDrawer(false)}
        >
          <Icon>clear</Icon>
        </IconButton>
        <AttractionFilter
          selectedCates={selectedCates}
          selectedTypes={selectedTypes}
          onCatesChange={setSelectedCates}
          onTypesChange={setSelectedTypes}
        ></AttractionFilter>
      </Drawer>
    </React.Fragment>
  )
}
