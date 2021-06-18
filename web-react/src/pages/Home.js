import React, { useEffect } from 'react'
import HomeMenu from '../components/Home/HomeMenu'
import { makeStyles } from '@material-ui/core/styles'
import { Link, useLocation } from 'react-router-dom'
import { Box, Grid, Typography, Paper } from '@material-ui/core'
import { useQuery, useLazyQuery, gql } from '@apollo/client'
import { imageContainer } from '../styles/image'
import { useUser, useUserInfo } from '../utils/hooks'
import HomeAttractionItem from '../components/Home/HomeAttractionItem'

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
    position: 'relative',
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
        url
      }
    }
  }
`

const GET_USER = gql`
  query getUserPreference($first: Int, $userId: ID!) {
    User(first: $first, filter: { id: $userId }) {
      recentViews {
        id
        name
        thumbnail {
          url
        }
        avgRating
        totalRating
      }
    }
    RecommendedAttractions(userId: $userId) {
      id
      name
      thumbnail {
        url
      }
      avgRating
      totalRating
    }
  }
`
const GET_RECENT_SIMILARS = gql`
  query getRecentSimilars(
    $attractionId: ID!
    $first: Int
    $offset: Int
    $orderBy: [_AttractionOrdering]
    $filter: _AttractionFilter
  ) {
    Attraction(
      id: $attractionId
      first: $first
      offset: $offset
      orderBy: $orderBy
      filter: $filter
    ) {
      name
      similars(first: 10) {
        id
        name
        avgRating
        totalRating
        city {
          name
        }
        types {
          name
        }
        thumbnail {
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
      city {
        name
      }
      thumbnail {
        url
      }
      avgRating
      totalRating
    }
  }
`
export default function Home() {
  const classes = useStyles()
  const user = useUser()
  const [userInfo, refetchUserInfo] = useUserInfo()
  const location = useLocation()
  const [getUser, { data: userData }] = useLazyQuery(GET_USER, {
    fetchPolicy: 'network-only',
  })
  const [getRecentSimilars, { data: recentSimilarsData }] = useLazyQuery(
    GET_RECENT_SIMILARS
  )
  const { data: cityData } = useQuery(GET_CITY)
  const { data: attractionData } = useQuery(GET_HOT_ATTRACTION)
  useEffect(() => {
    if (user) {
      getUser({
        variables: {
          userId: user.id,
        },
      })
    }
  }, [location.pathname])

  useEffect(() => {
    if (userData && userData.User[0]?.recentViews[0]) {
      getRecentSimilars({
        variables: { attractionId: userData.User[0].recentViews[0].id },
      })
    }
  }, [userData])

  return (
    <React.Fragment>
      <HomeMenu></HomeMenu>
      <Paper className={classes.paper}>
        {userData?.User[0]?.recentViews?.length > 0 && (
          <Box py={3}>
            <Typography variant="h3">Đã xem gần đây</Typography>
            <Grid container className={classes.gridList}>
              {userData.User[0].recentViews.map((attraction) => (
                <HomeAttractionItem
                  key={attraction.id}
                  attraction={attraction}
                  userInfo={userInfo}
                  onBookmarkChange={() => {
                    refetchUserInfo()
                  }}
                ></HomeAttractionItem>
              ))}
            </Grid>
          </Box>
        )}
        {userData?.RecommendedAttractions?.length && (
          <Box py={3}>
            <Typography variant="h3">Mọi người cũng thích</Typography>
            <Grid container className={classes.gridList}>
              {userData.RecommendedAttractions.map((attraction) => (
                <HomeAttractionItem
                  key={attraction.id}
                  attraction={attraction}
                  userInfo={userInfo}
                  onBookmarkChange={() => {
                    refetchUserInfo()
                  }}
                ></HomeAttractionItem>
              ))}
            </Grid>
          </Box>
        )}
        {recentSimilarsData?.Attraction?.length && (
          <Box py={3}>
            <Typography variant="h3">
              Tương tự với {recentSimilarsData?.Attraction[0]?.name}
            </Typography>
            <Grid container className={classes.gridList}>
              {recentSimilarsData.Attraction[0].similars.map((attraction) => (
                <HomeAttractionItem
                  key={attraction.id}
                  attraction={attraction}
                  userInfo={userInfo}
                  onBookmarkChange={() => {
                    refetchUserInfo()
                  }}
                ></HomeAttractionItem>
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
                    <Box mt={0.5} mb={1}>
                      {city.name}
                    </Box>
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
                <HomeAttractionItem
                  key={attraction.id}
                  attraction={attraction}
                  userInfo={userInfo}
                  onBookmarkChange={() => {
                    refetchUserInfo()
                  }}
                ></HomeAttractionItem>
              ))}
          </Grid>
        </Box>
      </Paper>
    </React.Fragment>
  )
}
