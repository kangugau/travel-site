import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Icon, IconButton, Tooltip } from '@material-ui/core'
import { useMutation, gql } from '@apollo/client'
import { useUser } from '../../utils/hooks'
import { AuthModalContext } from '../../contexts/AuthModalContext'

const SAVE_ATTRACTION = gql`
  mutation saveAttraction($userId: ID!, $attractionId: ID!) {
    AddUserSavedAttractions(from: { id: $userId }, to: { id: $attractionId }) {
      from {
        id
      }
      to {
        id
      }
    }
  }
`

const UNSAVE_ATTRACTION = gql`
  mutation unsaveAttraction($userId: ID!, $attractionId: ID!) {
    RemoveUserSavedAttractions(
      from: { id: $userId }
      to: { id: $attractionId }
    ) {
      from {
        id
      }
      to {
        id
      }
    }
  }
`

const useStyles = makeStyles((theme) => ({
  activeBookmark: {
    color: theme.palette.warning.main,
  },
}))

export default function BookmarkButton(props) {
  const classes = useStyles()
  const {
    attractionId,
    size = 'medium',
    className,
    userInfo,
    onBookmarkChange,
  } = props
  const { handleOpen } = useContext(AuthModalContext)
  const user = useUser()

  const [isBookMarked, setIsBookMarked] = useState(false)

  useEffect(() => {
    const temp =
      userInfo?.savedAttractions?.findIndex((attraction) => {
        return attraction.id === attractionId
      }) > -1
    setIsBookMarked(temp)
  }, [userInfo])
  let [saveAttractionMutation] = useMutation(SAVE_ATTRACTION)
  let [unsaveAttractionMutation] = useMutation(UNSAVE_ATTRACTION)

  const handleSaveAttraction = async (attractionId) => {
    if (isBookMarked) {
      await unsaveAttractionMutation({
        variables: {
          userId: user.id,
          attractionId,
        },
      })
      setIsBookMarked(!isBookMarked)
      onBookmarkChange()
    } else {
      await saveAttractionMutation({
        variables: {
          userId: user.id,
          attractionId,
        },
      })
      setIsBookMarked(!isBookMarked)
      onBookmarkChange()
    }
  }

  const onBookmarkClick = async () => {
    if (!user) {
      handleOpen(true)
    } else {
      try {
        await handleSaveAttraction(attractionId)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <Tooltip title="Lưu địa điểm">
      <IconButton
        variant="outlined"
        size={size}
        onClick={onBookmarkClick}
        className={className}
      >
        {isBookMarked ? (
          <Icon className={classes.activeBookmark}>bookmark</Icon>
        ) : (
          <Icon>bookmark_outlined</Icon>
        )}
      </IconButton>
    </Tooltip>
  )
}
