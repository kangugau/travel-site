import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Grid,
  Typography,
  Box,
  Icon,
  Paper,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  LinearProgress,
} from '@material-ui/core'
import { useParams, Link } from 'react-router-dom'
import Rating from '@material-ui/lab/Rating'
import { useQuery, gql } from '@apollo/client'
import { attractionRating, imageContainer } from '../styles'
import Reviews from '../components/Attraction/Reviews'

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
      similars {
        id
        name
        avgRating
        types {
          id
          name
        }
      }
    }
  }
`
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

// const ratingLabel = {
//   1: 'Kinh khủng',
//   2: 'Tồi',
//   3: 'Trung bình',
//   4: 'Tốt',
//   5: 'Tuyệt vời',
// }

export default function Attraction() {
  const classes = useStyles()
  let { id } = useParams()
  let { data: attractionData } = useQuery(GET_ATTRACTION_DETAIL, {
    variables: { attractionId: id },
  })
  return (
    <React.Fragment>
      <Paper elevation={0}>
        <Grid container>
          <Grid item className={classes.textBlock} xs={12} sm={12} md={5}>
            {attractionData && (
              <React.Fragment>
                <Typography
                  variant="h2"
                  component="h1"
                  className={classes.title}
                >
                  {attractionData.Attraction[0].name}
                </Typography>
                <Link
                  to={'/attraction/' + attractionData.Attraction[0].id}
                  className={classes.attractionRating}
                >
                  <Rating
                    value={attractionData.Attraction[0].avgRating}
                    precision={0.1}
                    readOnly
                  />
                  <Typography component="span">
                    {attractionData.Attraction[0].totalRating} đánh giá
                  </Typography>
                </Link>
                <Box mt={1}>
                  {attractionData.Attraction[0].types
                    .map((type) => {
                      return (
                        <Link
                          key={type.id}
                          to={'/city/' + attractionData.Attraction[0].city.id}
                        >
                          <Typography component="span">{type.name}</Typography>
                        </Link>
                      )
                    })
                    .reduce((prev, curr) => [prev, ', ', curr])}
                </Box>
                <Box my={1}>
                  <Icon className={classes.icon}>location_on</Icon>
                  <Box component="span" fontWeight={500} mr={0.5}>
                    Địa chỉ:
                  </Box>
                  {attractionData.Attraction[0].address}
                </Box>
              </React.Fragment>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={7}>
            {attractionData && (
              <div className={classes.imageContainer}>
                <img src={attractionData.Attraction[0].thumbnail.url}></img>
              </div>
            )}
          </Grid>
        </Grid>
      </Paper>
      <Box mt={5}>
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
              <Button variant="contained" color="primary">
                <Icon className={classes.icon}>create</Icon>
                Viết đánh giá
              </Button>
            </Box>
            {attractionData && (
              <Box my={1} display="flex" alignItems="center">
                <Box textAlign="center" mr={2}>
                  <Typography variant="h6">
                    {attractionData.Attraction[0].avgRating.toFixed(1)}
                  </Typography>
                  <Rating
                    value={attractionData.Attraction[0].avgRating}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <div>{attractionData.Attraction[0].totalRating} đánh giá</div>
                </Box>
                <Divider flexItem orientation="vertical"></Divider>
                <Box ml={2}>
                  <FormGroup>
                    {attractionData.Attraction[0].ratingCount.map((rating) => {
                      return (
                        <FormControlLabel
                          key={rating.rating}
                          control={<Checkbox color="primary" />}
                          label={
                            <div className={classes.ratingLabel}>
                              <Rating
                                value={rating.rating}
                                readOnly
                                size="small"
                              />
                              <LinearProgress
                                className={classes.ratingBar}
                                variant="determinate"
                                value={
                                  (rating.count * 100) /
                                  attractionData.Attraction[0].totalRating
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
            )}
          </Paper>
          <Box mt={2}>
            <Reviews attractionId={id}></Reviews>
          </Box>
        </Grid>
      </Box>
    </React.Fragment>
  )
}
