import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import Rating from '@material-ui/lab/Rating'
import { useQuery, gql } from '@apollo/client'

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

function roundHalf(num) {
  return Math.floor(num * 2) / 2
}
export default function Attraction() {
  const useStyles = makeStyles(() => ({
    root: {
      display: 'flex',
    },
    summary: {},
    imageContainer: {
      '& img': {
        width: '100%',
      },
    },
  }))
  const classes = useStyles()
  let { id } = useParams()
  let { data: attractionData } = useQuery(GET_ATTRACTION_DETAIL, {
    variables: { attractionId: id },
  })
  return (
    <React.Fragment>
      <Grid container>
        <Grid item className={classes.summary} sm={5}>
          {attractionData && (
            <React.Fragment>
              <Typography variant="h6">
                {attractionData.Attraction[0].name}
              </Typography>
              <Rating
                value={roundHalf(attractionData.Attraction[0].avgRating)}
                precision={0.5}
                readOnly
              />
              <div>
                {attractionData.Attraction[0].categories
                  .map((cate) => cate.name)
                  .join(', ')}
              </div>
              <div>{attractionData.Attraction[0].address}</div>
            </React.Fragment>
          )}
        </Grid>
        <Grid item sm={7}>
          {attractionData && (
            <div className={classes.imageContainer}>
              <img src={attractionData.Attraction[0].thumbnail.url}></img>
            </div>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
