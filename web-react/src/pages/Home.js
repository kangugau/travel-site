import React, { useEffect } from 'react'
import HomeMenu from '../components/Home/HomeMenu'
import { makeStyles } from '@material-ui/core/styles'
import { Link, useLocation } from 'react-router-dom'
import { Box, Grid, Typography, Paper } from '@material-ui/core'
import { useQuery, useLazyQuery, gql } from '@apollo/client'
import { imageContainer } from '../styles/image'
import { useUser, useUserInfo } from '../utils/hooks'
import { Rating } from '@material-ui/lab'
import { attractionRating } from '../styles'
import BookmarkButton from '../components/Attraction/BookmarkButton'

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
  bookmarkButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: '#fff',
    zIndex: '1',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
  },
  imageContainer,
  attractionRating,
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
        avgRating
        totalRating
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
  const attractionItem = (attraction) => (
    <Grid
      item
      key={attraction.id}
      xs={8}
      sm={4}
      lg={3}
      className={classes.gridItem}
    >
      <BookmarkButton
        size="small"
        userInfo={userInfo}
        attractionId={attraction.id}
        className={classes.bookmarkButton}
        onBookmarkChange={() => {
          refetchUserInfo()
        }}
      ></BookmarkButton>
      <Link to={'/attraction/' + attraction.id}>
        <div className={classes.imageContainer}>
          <img src={attraction.thumbnail.url} alt={attraction.name} />
        </div>
        <Box mt={0.5} mb={1}>
          <div>{attraction.name}</div>
          <div className={classes.attractionRating}>
            <Rating value={attraction.avgRating} precision={0.1} readOnly />
            <Typography component="span">
              {attraction.totalRating} đánh giá
            </Typography>
          </div>
        </Box>
      </Link>
    </Grid>
  )
  return (
    <React.Fragment>
      <HomeMenu></HomeMenu>
      <Paper className={classes.paper}>
        {userData?.User[0]?.recentViews?.length > 0 && (
          <Box py={3}>
            <Typography variant="h3">Đã xem gần đây</Typography>
            <Grid container className={classes.gridList}>
              {userData.User[0].recentViews.map((attraction) =>
                attractionItem(attraction)
              )}
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
              attractionData.HotAttractions.map((attraction) =>
                attractionItem(attraction)
              )}
          </Grid>
        </Box>
      </Paper>
    </React.Fragment>
  )
}
