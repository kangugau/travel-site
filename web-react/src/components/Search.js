import React, { useState } from 'react'
import {
  Typography,
  Box,
  Icon,
  Paper,
  TextField,
  InputAdornment,
  Popper,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useLazyQuery, gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import { nonAccentVietnamese } from '../utils/text'
const FULL_TEXT_SEARCH = gql`
  query fullTextSearch($keyword: String, $first: Int = 5) {
    searchResult: fullTextSearch(keyword: $keyword, first: $first) {
      __typename
      ... on City {
        id
        name
      }
      ... on Attraction {
        id
        name
        thumbnail {
          url
        }
        city {
          id
          name
        }
      }
    }
  }
`
const useStyles = makeStyles((theme) => ({
  searchPopover: {
    width: '400px',
    maxWidth: '90vw',
    zIndex: theme.zIndex['tooltip'],
  },
  searchItem: {
    padding: theme.spacing(1),
  },
  searchIcon: {
    width: theme.spacing(5),
    fontSize: theme.spacing(5),
    marginRight: theme.spacing(1),
  },
  imageContainer: {
    position: 'relative',
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginRight: theme.spacing(1),
    '& img': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      top: '0',
      left: '0',
    },
  },
}))
let timeoutId = null
export default function Search() {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState(null)

  const handleFocus = (event) => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const [open, setOpen] = useState(false)
  const id = open ? 'simple-popover' : undefined

  const [keyword, setKeyword] = useState('')

  const onKeywordChange = (event) => {
    const value = event.target.value
    setKeyword(value)
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      search({
        variables: {
          keyword: nonAccentVietnamese(value),
        },
      })
    }, 500)
  }

  const [search, { data }] = useLazyQuery(FULL_TEXT_SEARCH)
  return (
    <Box className={classes.navItem}>
      <TextField
        fullWidth
        value={keyword}
        onChange={onKeywordChange}
        aria-describedby={id}
        onClick={handleFocus}
        onBlur={() => {
          setTimeout(() => {
            handleClose()
          }, 300)
        }}
        variant="outlined"
        size="small"
        InputProps={{
          placeholder: 'Tìm kiếm địa điểm',
          startAdornment: (
            <InputAdornment position="start">
              <Icon>search</Icon>
            </InputAdornment>
          ),
        }}
      ></TextField>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className={classes.searchPopover}
        placement="bottom-start"
      >
        <Paper elevation={3}>
          {data?.searchResult?.length > 0 && (
            <Box p={1}>
              {data.searchResult.map((item) =>
                item.__typename == 'City' ? (
                  <Link key={item.id} to={'/city/' + item.id}>
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.searchItem}
                    >
                      <Icon className={classes.searchIcon}>location_city</Icon>
                      <Typography variant="h6">{item.name}</Typography>
                    </Box>
                  </Link>
                ) : (
                  <Link key={item.id} to={'/attraction/' + item.id}>
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.searchItem}
                    >
                      {item.thumbnail ? (
                        <div className={classes.imageContainer}>
                          <img src={item.thumbnail.url}></img>
                        </div>
                      ) : (
                        <Icon className={classes.searchIcon}>place</Icon>
                      )}
                      <div>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography variant="body2">
                          {item.city.name}
                        </Typography>
                      </div>
                    </Box>
                  </Link>
                )
              )}
            </Box>
          )}
        </Paper>
      </Popper>
    </Box>
  )
}
