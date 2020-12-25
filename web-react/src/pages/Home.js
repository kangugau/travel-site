import React from 'react'
import HomeMenu from '../components/Home/HomeMenu'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { Box, Grid, Typography } from '@material-ui/core'
import { useQuery, gql } from '@apollo/client'

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
  },
  imageContainer: {
    paddingTop: '66.67%',
    position: 'relative',
    '& img': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      top: '0',
      left: '0',
    },
  },
}))

const GET_CITY = gql`
  query getCities(
    $first: Int
    $offset: Int
    $orderBy: [_CityOrdering]
    $filter: _CityFilter
  ) {
    City(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      id
      name
      thumbnail {
        width
        height
        url
      }
    }
  }
`

const GET_HOT_ATTRACTION = gql`
  query getHotAttractions($first: Int) {
    hotAttractions(first: $first) {
      id
      name
      types {
        name
      }
      city {
        name
      }
      thumbnail {
        width
        height
        url
      }
    }
  }
`
export default function Home() {
  const classes = useStyles()

  const { data: cityData } = useQuery(GET_CITY)
  const { data: attractionData } = useQuery(GET_HOT_ATTRACTION)

  return (
    <React.Fragment>
      <HomeMenu></HomeMenu>
      <Box py={3}>
        <Typography variant="h3">Tìm kiếm gần đây</Typography>
      </Box>
      <Box py={3}>
        <Typography variant="h3">Thành phố hàng đầu</Typography>
        <Grid container className={classes.gridList} spacing={2}>
          {cityData &&
            cityData.City.map((city) => (
              <Grid
                item
                key={city.id}
                xs={8}
                sm={4}
                lg={3}
                className={classes.gridItem}
              >
                <Link to={'/city/' + city.id}>
                  <div className={classes.imageContainer}>
                    <img src={city.thumbnail?.url} alt={city.name} />
                  </div>
                  <p>{city.name}</p>
                </Link>
              </Grid>
            ))}
        </Grid>
      </Box>
      <Box py={3}>
        <Typography variant="h3">Điểm đến hàng đầu</Typography>
        <Grid container className={classes.gridList} spacing={2}>
          {attractionData &&
            attractionData.hotAttractions.map((attraction) => (
              <Grid
                item
                key={attraction.id}
                xs={8}
                sm={4}
                lg={3}
                className={classes.gridItem}
              >
                <Link to={'/attraction/' + attraction.id}>
                  <div className={classes.imageContainer}>
                    <img src={attraction.thumbnail.url} alt={attraction.name} />
                  </div>
                  <p>{attraction.name}</p>
                </Link>
              </Grid>
            ))}
        </Grid>
      </Box>
    </React.Fragment>
  )
}
