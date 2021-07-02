import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Icon, IconButton, Tooltip } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  editButton: {},
  deleteButton: {
    color: theme.palette.error.main,
  },
}))

export default function TypeActions({ id, editType, deleteType }) {
  const classes = useStyles()
  return (
    <>
      <Tooltip title="Sửa thể loại">
        <IconButton color="primary" onClick={() => editType(id)}>
          <Icon>edit</Icon>
        </IconButton>
      </Tooltip>
      <Tooltip title="Xóa thể loại" onClick={() => deleteType(id)}>
        <IconButton className={classes.deleteButton}>
          <Icon>delete</Icon>
        </IconButton>
      </Tooltip>
    </>
  )
}
