import React from 'react'
import { Box, CircularProgress } from '@material-ui/core'
// import { makeStyles } from '@material-ui/core/styles'
// const useStyles = makeStyles((theme)=> ({
//   loadingContainer: {

//   }
// }))
export default function Loading() {
  // const classes = useStyles()
  return (
    <Box
      width="100%"
      minHeight="150px"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress></CircularProgress>
    </Box>
  )
}
