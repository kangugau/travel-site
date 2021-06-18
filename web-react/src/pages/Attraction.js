import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Box, Icon, Paper, Divider } from '@material-ui/core'
import { useParams, Link, useLocation } from 'react-router-dom'
import Rating from '@material-ui/lab/Rating'
import { useQuery, useMutation, gql } from '@apollo/client'
import { attractionRating, imageContainer, cursorPointer } from '../styles'
import Reviews from '../components/Attraction/Reviews'
import { useUser, useUserInfo } from '../utils/hooks'
import moment from 'moment'
import Map from '../components/Map'
import clsx from 'clsx'
import BookmarkButton from '../components/Attraction/BookmarkButton'
import MiniAttractionItem from '../components/MiniAttractionItem'

const GET_ATTRACTION_DETAIL = gql`
  query getAttractionDetail(
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
      id
      name
      location {
        latitude
        longitude
      }
      address
      city {
        id
        name
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
      ratingCount {
        rating
        count
      }
      thumbnail {
        width
        height
        url
      }
      similarsNearBy(first: 4) {
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
    AttractionsNearBy(attractionId: $attractionId, first: 4) {
      attraction {
        name
        id
        avgRating
        totalRating
        types {
          name
        }
        thumbnail {
          url
        }
      }
      distance
    }
  }
`

const LOG_VIEWED_ATTRACTION = gql`
  mutation LogAction(
    $userId: ID!
    $attractionId: ID!
    $lastViewedDate: _Neo4jDateTimeInput!
  ) {
    LogViewedAttraction(
      userId: $userId
      attractionId: $attractionId
      lastViewedDate: $lastViewedDate
    ) {
      id
    }
  }
`

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  title: {
    fontWeight: '500',
    flex: '1 1',
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
  notFound: {
    padding: theme.spacing(5),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeBookmark: {
    color: theme.palette.warning.main,
  },
  similars: {
    marginTop: '12px',
  },
  nearBy: {
    flexWrap: 'wrap',
    marginTop: '12px',
  },
  imageContainer,
  attractionRating,
  cursorPointer,
}))

// const ratingLabel = {
//   1: 'Kinh khủng',
//   2: 'Tồi',
//   3: 'Trung bình',
//   4: 'Tốt',
//   5: 'Tuyệt vời',
// }

export default function Attraction() {
  const classes = useStyles()
  const location = useLocation()
  let { id } = useParams()
  let { data: attractionData } = useQuery(GET_ATTRACTION_DETAIL, {
    variables: { attractionId: id },
  })
  const user = useUser()
  const [userInfo] = useUserInfo()

  let [logAction] = useMutation(LOG_VIEWED_ATTRACTION)
  useEffect(() => {
    const callMutation = async () => {
      try {
        await logAction({
          variables: {
            userId: user.id,
            attractionId: id,
            lastViewedDate: {
              formatted: moment().format(),
            },
          },
        })
      } catch (error) {
        console.log(error)
      }
    }
    if (user) {
      callMutation()
    }
  }, [location.pathname])
  // useEffect(() => {
  //   console.log({ userInfo })
  // }, [userInfo])
  return (
    <React.Fragment>
      {attractionData?.Attraction?.length == 0 && (
        <div className={classes.notFound}>
          <Icon fontSize="large">sentiment_very_dissatisfied</Icon>
          <Typography variant="h6">Không tìm thấy địa điểm</Typography>
        </div>
      )}
      {attractionData?.Attraction?.length > 0 && (
        <React.Fragment>
          <Paper elevation={0}>
            <Grid container>
              <Grid item className={classes.textBlock} xs={12} sm={12} md={5}>
                <React.Fragment>
                  <Box display="flex">
                    <Typography
                      variant="h2"
                      component="h1"
                      className={classes.title}
                    >
                      {attractionData.Attraction[0].name}
                    </Typography>
                    <div>
                      <BookmarkButton
                        attractionId={id}
                        userInfo={userInfo}
                      ></BookmarkButton>
                    </div>
                  </Box>
                  <span
                    className={clsx(
                      classes.attractionRating,
                      classes.cursorPointer
                    )}
                  >
                    <Rating
                      value={attractionData.Attraction[0].avgRating}
                      precision={0.1}
                      readOnly
                    />
                    <Typography component="span">
                      {attractionData.Attraction[0].totalRating} đánh giá
                    </Typography>
                  </span>
                  <Box mt={1}>
                    {attractionData.Attraction[0].types
                      .map((type) => {
                        return (
                          <Link
                            key={type.id}
                            to={'/city/' + attractionData.Attraction[0].city.id}
                          >
                            <Box component="span" fontWeight={500}>
                              {type.name}
                            </Box>
                          </Link>
                        )
                      })
                      .reduce((prev, curr) => [prev, ', ', curr])}
                  </Box>
                  <Box mt={2}>
                    Khu phố cổ là nơi hội tụ của 36 phố phường buôn bán sầm uất
                    có bề dày gần một ngàn năm lịch sử. Mỗi tên phố thường mang
                    đặc trưng của một ngành nghề thủ công truyền thống như: Hàng
                    Bông, Hàng Gai, Lò Rèn, Hàng Đường,...
                  </Box>
                  <Box my={2}>
                    <Icon className={classes.icon}>location_on</Icon>
                    <Box component="span" fontWeight={500} mr={0.5}>
                      Địa chỉ:
                    </Box>
                    {attractionData.Attraction[0].address}
                  </Box>
                </React.Fragment>
              </Grid>
              <Grid item xs={12} sm={12} md={7}>
                {attractionData.Attraction[0].thumbnail && (
                  <div className={classes.imageContainer}>
                    <img src={attractionData.Attraction[0].thumbnail.url}></img>
                  </div>
                )}
              </Grid>
            </Grid>
          </Paper>
          <Box mt={3} mb={5}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={6}>
                <Map
                  marker={{ ...attractionData.Attraction[0].location }}
                ></Map>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Typography variant="h4">Địa điểm lân cận</Typography>
                <Grid container spacing={2} className={classes.nearBy}>
                  {attractionData?.AttractionsNearBy?.map((item) => (
                    <Grid item xs={6} sm={6} md={6} key={item.attraction.id}>
                      <MiniAttractionItem
                        attraction={item.attraction}
                        tallImg={true}
                        distance={item.distance}
                      ></MiniAttractionItem>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Divider></Divider>
          <Box mt={5}>
            <Typography variant="h4">Có thể bạn sẽ thích</Typography>
            <Grid container spacing={2} className={classes.similars}>
              {attractionData?.Attraction[0]?.similarsNearBy?.map((item) => (
                <Grid item xs={6} sm={3} md={3} key={item.id}>
                  <MiniAttractionItem
                    attraction={item}
                    tallImg={true}
                  ></MiniAttractionItem>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box mt={5}>
            <Reviews
              id="review"
              attraction={attractionData.Attraction[0]}
            ></Reviews>
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
