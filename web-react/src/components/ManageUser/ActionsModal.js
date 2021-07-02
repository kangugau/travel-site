import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Modal,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
} from '@material-ui/core'
import { useValidator, required, email } from '../../utils/validators'
import { useMutation, gql } from '@apollo/client'

const ADD_USER = gql`
  mutation addUser($name: String) {
    CreateUser(username: $name) {
      id
      username
    }
  }
`

const EDIT_USER = gql`
  mutation editUser($id: ID!, $name: String, $email: String, $role: Role) {
    UpdateUser(id: $id, username: $name, email: $email, role: $role) {
      id
      username
    }
  }
`

const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    DeleteUser(id: $id) {
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
  user,
  closeModal,
  onActionSucceed,
}) {
  const classes = useStyles()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  })
  useEffect(() => {
    setFormData({
      name: user?.username || '',
      email: user?.email || '',
      role: user?.role || '',
    })
  }, [user])
  const [addUser] = useMutation(ADD_USER, {
    variables: {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    },
  })

  const [editUser] = useMutation(EDIT_USER, {
    variables: {
      id: user?.id,
      name: formData.name,
      email: formData.email,
      role: formData.role,
    },
  })
  const [deleteUser] = useMutation(DELETE_USER, {
    variables: {
      id: user?.id,
    },
  })
  const actions = {
    add: { title: 'Thêm người dùng', function: addUser },
    edit: { title: 'Sửa người dùng', function: editUser },
    delete: { title: 'Xóa người dùng', function: deleteUser },
  }

  const rules = {
    name: [{ validator: required, message: 'Tên là bắt buộc' }],
    email: [
      { validator: required, message: 'Email là bắt buộc' },
      { validator: email, message: 'Email không đúng định dạng' },
    ],
    role: [{ validator: required, message: 'Vai trò là bắt buộc' }],
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
            <>
              <TextField
                type="text"
                required
                label="Tên người dùng"
                fullWidth
                variant="outlined"
                margin="normal"
                color="primary"
                error={Boolean(errors.name.length)}
                helperText={errors.name.length ? errors.name[0].message : ''}
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
                onBlur={() => validate(formData, 'name')}
              ></TextField>
              <TextField
                type="text"
                required
                label="Email"
                fullWidth
                variant="outlined"
                margin="normal"
                color="primary"
                error={Boolean(errors.email.length)}
                helperText={errors.email.length ? errors.email[0].message : ''}
                value={formData.email}
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
                onBlur={() => validate(formData, 'email')}
              ></TextField>
              <TextField
                select
                required
                label="Vai trò"
                fullWidth
                variant="outlined"
                margin="normal"
                color="primary"
                error={Boolean(errors.role.length)}
                helperText={errors.role.length ? errors.role[0].message : ''}
                value={formData.role}
                onChange={(event) =>
                  setFormData({ ...formData, role: event.target.value })
                }
                onBlur={() => validate(formData, 'role')}
              >
                <MenuItem value="USER">USER</MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
              </TextField>
            </>
          )}
          {action === 'delete' && (
            <div>{`Bạn muốn xóa người dùng "${user.name}"`}</div>
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
