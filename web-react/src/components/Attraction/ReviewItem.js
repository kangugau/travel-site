import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  Box,
  Avatar,
  Divider,
  IconButton,
  Icon,
  Menu,
  MenuItem,
} from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import { useMutation, gql } from '@apollo/client'

import moment from 'moment'
import { useUser } from '../../utils/hooks'
import { Link } from 'react-router-dom'

const DELETE_REVIEW = gql`
  mutation deleteReview($reviewId: ID!) {
    DeleteReview(id: $reviewId) {
      id
    }
  }
`
const useStyles = makeStyles((theme) => ({
  username: { fontWeight: 'bold' },
  reviewProp: {
    fontWeight: 500,
  },
  reviewDate: { color: theme.palette.grey[600] },
}))
export function ReviewItem(props) {
  const { review, onDeleteReview } = props
  const classes = useStyles()
  const user = useUser()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const [deleteReview] = useMutation(DELETE_REVIEW, {
    variables: {
      reviewId: review.id,
    },
  })

  const handleDeleteReview = async () => {
    try {
      await deleteReview()
      onDeleteReview()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <Divider></Divider>
      <Box my={3}>
        <Box display="flex">
          <Link to={'/user/' + review.owner.id}>
            <Avatar
              alt={review.owner.displayName}
              src={review.owner.avatar?.url}
            ></Avatar>
          </Link>
          <Box ml={2} flex="1 1">
            <Link to={'/user/' + review.owner.id}>
              <div className={classes.username}>{review.owner.displayName}</div>
            </Link>
            <div className={classes.reviewDate}>
              {'Đánh giá vào ngày ' +
                moment(review.publishedDate.formatted).format('Do MMMM, YYYY')}
            </div>
          </Box>
          {user && user.id === review.owner.id && (
            <Box ml={2}>
              <IconButton onClick={handleClick}>
                <Icon>more_vert</Icon>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                keepMounted
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleDeleteReview}>Xóa</MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
        <Box pt={2}>
          <Rating readOnly value={review.rating}></Rating>
        </Box>
        <Box pt={1}>
          <Typography variant="h6">{review.title}</Typography>
        </Box>
        <Box pt={1}>
          <span>{review.text}</span>
        </Box>
      </Box>
    </React.Fragment>
  )
}
