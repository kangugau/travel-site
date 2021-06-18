import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Icon, IconButton, Tooltip } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  editButton: {},
  deleteButton: {
    color: theme.palette.error.main,
  },
}))

export default function CategoryActions({ id, editCategory, deleteCategory }) {
  const classes = useStyles()
  return (
    <>
      <Tooltip title="Sửa danh mục">
        <IconButton color="primary" onClick={() => editCategory(id)}>
          <Icon>edit</Icon>
        </IconButton>
      </Tooltip>
      <Tooltip title="Xóa danh mục" onClick={() => deleteCategory(id)}>
        <IconButton className={classes.deleteButton}>
          <Icon>delete</Icon>
        </IconButton>
      </Tooltip>
    </>
  )
}
