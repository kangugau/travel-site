import React, { useEffect } from 'react'
import HomeMenu from '../components/Home/HomeMenu'
import { makeStyles } from '@material-ui/core/styles'
import { Link, useLocation } from 'react-router-dom'
import { Box, Grid, Typography, Paper } from '@material-ui/core'
import { useQuery, useLazyQuery, gql } from '@apollo/client'
import { imageContainer } from '../styles/image'
import { useUser } from '../utils/hooks'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    padding: theme.spacing(2),
    overflow: 'hidden',
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
    gap: theme.spacing(2),
  },
  gridItem: {
    flexShrink: 0,
  },
  imageContainer,
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

const GET_USER = gql`
  query getRecentViews($first: Int, $filter: _UserFilter) {
    User(first: $first, filter: $filter) {
      recentViews {
        id
        name
        thumbnail {
          width
          height
          url
        }
      }
    }
  }
`
const GET_HOT_ATTRACTION = gql`
  query getHotAttractions($first: Int) {
    HotAttractions(first: $first) {
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
  const user = useUser()
  const location = useLocation()
  const [getUser, { data: userData }] = useLazyQuery(GET_USER, {
    fetchPolicy: 'network-only',
  })
  const { data: cityData } = useQuery(GET_CITY)
  const { data: attractionData } = useQuery(GET_HOT_ATTRACTION)
  useEffect(() => {
    if (user) {
      getUser({
        variables: {
          filter: {
            id: user.id,
          },
        },
      })
    }
  }, [location.pathname])

  return (
    <React.Fragment>
      <HomeMenu></HomeMenu>
      <Paper className={classes.paper}>
        {userData?.User[0]?.recentViews?.length > 0 && (
          <Box py={3}>
            <Typography variant="h3">Đã xem gần đây</Typography>
            <Grid container className={classes.gridList}>
              {userData.User[0].recentViews.map((attraction) => (
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
                      <img
                        src={attraction.thumbnail.url}
                        alt={attraction.name}
                      />
                    </div>
                    <p>{attraction.name}</p>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        <Box py={3}>
          <Typography variant="h3">Thành phố hàng đầu</Typography>
          <Grid container className={classes.gridList}>
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
        <Box pt={3}>
          <Typography variant="h3">Điểm đến hàng đầu</Typography>
          <Grid container className={classes.gridList}>
            {attractionData &&
              attractionData.HotAttractions.map((attraction) => (
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
                      <img
                        src={attraction.thumbnail.url}
                        alt={attraction.name}
                      />
                    </div>
                    <p>{attraction.name}</p>
                  </Link>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Paper>
    </React.Fragment>
  )
}
