import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Modal, Typography, Paper, TextField, Button } from '@material-ui/core'
import { useValidator, required } from '../../utils/validators'
import { useMutation, gql } from '@apollo/client'

const ADD_CATEGORY = gql`
  mutation addCategory($name: String) {
    CreateCategory(name: $name) {
      id
      name
    }
  }
`

const EDIT_CATEGORY = gql`
  mutation addCategory($id: ID!, $name: String) {
    UpdateCategory(id: $id, name: $name) {
      id
      name
    }
  }
`

const DELETE_CATEGORY = gql`
  mutation addCategory($id: ID!) {
    DeleteCategory(id: $id) {
      id
      name
    }
  }
`

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    padding: theme.spacing(2),
    width: 'calc(100vw - 16px)',
    maxWidth: '400px',
  },
  body: {
    padding: '16px 0',
  },
  modalFooter: {
    textAlign: 'right',
  },
  footerBtn: {
    margin: theme.spacing(1),
  },
}))

export default function ActionsModal({
  open,
  action,
  category,
  closeModal,
  onActionSucceed,
}) {
  const classes = useStyles()
  const [formData, setFormData] = useState({
    name: '',
  })
  useEffect(() => {
    setFormData({ name: category?.name || '' })
  }, [category])
  const [addCategory] = useMutation(ADD_CATEGORY, {
    variables: {
      name: formData.name,
    },
  })

  const [editCategory] = useMutation(EDIT_CATEGORY, {
    variables: {
      id: category?.id,
      name: formData.name,
    },
  })
  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    variables: {
      id: category?.id,
    },
  })
  const actions = {
    add: { title: 'Thêm danh mục', function: addCategory },
    edit: { title: 'Sửa danh mục', function: editCategory },
    delete: { title: 'Xóa danh mục', function: deleteCategory },
  }

  const rules = {
    name: [{ validator: required, message: 'Tên là bắt buộc' }],
  }
  const { errors, validate, resetErr } = useValidator(rules)
  const confirmAction = async () => {
    const valid = validate(formData)
    if (!valid) return
    await actions[action].function()
    onActionSucceed()
    closeModal()
  }
  return (
    <Modal
      open={open}
      className={classes.modal}
      onClose={() => {
        closeModal()
        resetErr()
      }}
    >
      <Paper className={classes.modalContent}>
        <Typography variant="h5" className={classes.title}>
          {actions[action]?.title}
        </Typography>
        <div className={classes.body}>
          {(action === 'add' || action === 'edit') && (
            <TextField
              type="text"
              required
              label="Tên danh mục"
              fullWidth
              variant="outlined"
              margin="normal"
              color="primary"
              error={Boolean(errors.name.length)}
              helperText={errors.name.length ? errors.name[0].message : ''}
              value={formData.name}
              onChange={(event) => setFormData({ name: event.target.value })}
              onBlur={() => validate(formData, 'name')}
            ></TextField>
          )}
          {action === 'delete' && (
            <div>{`Bạn muốn xóa danh mục "${category.name}"`}</div>
          )}
        </div>
        <div className={classes.modalFooter}>
          <Button
            variant="contained"
            className={classes.footerBtn}
            onClick={closeModal}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.footerBtn}
            onClick={confirmAction}
          >
            Xác nhận
          </Button>
        </div>
      </Paper>
    </Modal>
  )
}
