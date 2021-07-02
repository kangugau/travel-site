import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Modal, Typography, Paper, TextField, Button } from '@material-ui/core'
import { useValidator, required } from '../../utils/validators'
import { useMutation, gql } from '@apollo/client'

const ADD_TAG = gql`
  mutation addTag($name: String) {
    CreateTag(name: $name) {
      id
      name
    }
  }
`

const EDIT_TAG = gql`
  mutation addTag($id: ID!, $name: String) {
    UpdateTag(id: $id, name: $name) {
      id
      name
    }
  }
`

const DELETE_TAG = gql`
  mutation addTag($id: ID!) {
    DeleteTag(id: $id) {
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
  tag,
  closeModal,
  onActionSucceed,
}) {
  const classes = useStyles()
  const [formData, setFormData] = useState({
    name: '',
  })
  useEffect(() => {
    setFormData({ name: tag?.name || '' })
  }, [tag])
  const [addTag] = useMutation(ADD_TAG, {
    variables: {
      name: formData.name,
    },
  })

  const [editTag] = useMutation(EDIT_TAG, {
    variables: {
      id: tag?.id,
      name: formData.name,
    },
  })
  const [deleteTag] = useMutation(DELETE_TAG, {
    variables: {
      id: tag?.id,
    },
  })
  const actions = {
    add: { title: 'Thêm thẻ', function: addTag },
    edit: { title: 'Sửa thẻ', function: editTag },
    delete: { title: 'Xóa thẻ', function: deleteTag },
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
              tag="text"
              required
              label="Tên thẻ"
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
          {action === 'delete' && <div>{`Bạn muốn xóa thẻ "${tag.name}"`}</div>}
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
