import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { Box, useMediaQuery } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'

export default function CustomPagination(props) {
  const theme = useTheme()
  const xsDown = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Pagination
        {...props}
        shape="rounded"
        color="primary"
        size={xsDown ? 'medium' : 'large'}
      ></Pagination>
    </Box>
  )
}
