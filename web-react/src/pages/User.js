import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Avatar,
  Box,
  Button,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core'
import { useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router'
import { UserReviewItem as UserReviewItem } from '../components/User/UserReviewItem'
import { useUser } from '../utils/hooks'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  avatar: {
    marginRight: theme.spacing(1),
    width: '100px',
    height: '100px',
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    marginTop: theme.spacing(3),
    maxWidth: '600px',
    margin: 'auto',
  },
  userInfo: {
    flex: '1 1',
  },
  summary: {
    maxWidth: '800px',
    margin: 'auto',
  },
}))

const GET_USER = gql`
  query getRecentViews($first: Int, $filter: _UserFilter) {
    User(first: $first, filter: $filter) {
      id
      email
      displayName
      avatar {
        url
      }
      reviews {
        id
        createdDate {
          formatted
        }
        publishedDate {
          formatted
        }
        owner {
          id
          displayName
        }
        attraction {
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
        title
        text
        rating
        photos {
          url
        }
      }
      savedAttractions {
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
  }
`

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}
function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}

export default function City() {
  const classes = useStyles()
  const { id } = useParams()
  const user = useUser()
  const [tab, setTab] = React.useState(0)
  const handleTabChange = (event, value) => {
    setTab(value)
  }
  const { data: userData } = useQuery(GET_USER, {
    variables: {
      filter: {
        id: id,
      },
    },
  })
  return (
    <React.Fragment>
      <Paper className={classes.summary}>
        {userData && (
          <Box display="flex" p={2}>
            <Avatar className={classes.avatar}></Avatar>
            <div className={classes.userInfo}>
              <Typography variant="h4">
                {userData.User[0].displayName}
              </Typography>
            </div>
            <div>
              {userData?.User[0].id === user.id && (
                <Button variant="outlined">Sửa hồ sơ</Button>
              )}
            </div>
          </Box>
        )}
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
          aria-label="disabled tabs example"
        >
          <Tab label="Đánh giá" {...a11yProps(0)} />
          {userData?.User[0].id === user.id && (
            <Tab label="Đã lưu" {...a11yProps(1)} />
          )}
        </Tabs>
      </Paper>
      <TabPanel value={tab} index={0}>
        <div className={classes.reviewList}>
          {userData &&
            userData.User[0].reviews.map((review) => (
              <UserReviewItem key={review.id} review={review}></UserReviewItem>
            ))}
        </div>
      </TabPanel>
    </React.Fragment>
  )
}
