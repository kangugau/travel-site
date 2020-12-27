import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, CircularProgress, Backdrop } from '@material-ui/core'
import { useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router-dom'
const useStyles = makeStyles(() => ({
  title: {
    fontWeight: '500',
  },
}))

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
export default function City() {
  const classes = useStyles()
  const params = useParams()
  const { loading, data: cityData, error: cityError } = useQuery(GET_CITY, {
    variables: {
      id: params.id,
    },
  })
  return (
    <React.Fragment>
      <Backdrop open={loading}>
        <CircularProgress></CircularProgress>
      </Backdrop>
      {cityError && (
        <Typography variant="h1" className={classes.title}>
          Đã xảy ra lỗi
        </Typography>
      )}
      {cityData && (
        <Box>
          <Typography variant="h1" className={classes.title}>
            {cityData.City[0].name}
          </Typography>
          <img src={cityData.City[0].thumbnail.url} />
        </Box>
      )}
    </React.Fragment>
  )
}
