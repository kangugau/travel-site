import React, { useEffect, useState } from 'react'
import { Button, TextField, Box, Snackbar } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/core/styles'
import { useMutation, gql } from '@apollo/client'
import { email, required, equal, useValidator } from '../../utils/validators'

const useStyles = makeStyles((theme) => ({
  marginTop: {
    marginTop: theme.spacing(3),
  },
}))

const CREATE_USER = gql`
  mutation Register($email: String!, $username: String!, $password: String!) {
    CreateUser(email: $email, username: $username, password: $password) {
      id
      email
    }
  }
`

export default function RegisterModal(props) {
  const classes = useStyles()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    passwordConfirm: '',
  })
  const [messageOpen, setMessageOpen] = useState(false)
  const [isErrorMess, setIsErrorMess] = useState('error')
  const setField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const rules = {
    email: [
      { validator: required, message: 'Email là bắt buộc' },
      { validator: email, message: 'Email không đúng định dạng' },
    ],
    username: [{ validator: required, message: 'Tên tài khoản là bắt buộc' }],
    password: [{ validator: required, message: 'Mật khẩu là bắt buộc' }],
    passwordConfirm: [
      { validator: required, message: 'Xác nhận mật khẩu là bắt buộc' },
      {
        validator: (input) => equal(input, formData.password),
        message: 'Xác nhận mật khẩu không đúng',
      },
    ],
  }
  const { errors, hasErr, validate } = useValidator(rules)
  const [register, { error: registerError }] = useMutation(CREATE_USER, {
    variables: {
      email: formData.email,
      password: formData.password,
      username: formData.username,
    },
    ignoreResults: false,
  })
  useEffect(() => {
    if (registerError) {
      setIsErrorMess(true)
      setMessageOpen(true)
    }
  }, [registerError])
  const submit = async () => {
    validate(formData)
    if (hasErr()) return
    try {
      await register()
      setIsErrorMess(false)
      setMessageOpen(true)
      setTimeout(() => {
        props.handleClose()
      }, 1000)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <React.Fragment>
      {registerError && (
        <Box py={1} color="error.main">
          {registerError.message}
        </Box>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={messageOpen}
        autoHideDuration={3000}
        onClose={() => setMessageOpen(false)}
      >
        <Alert
          variant="filled"
          onClose={() => setMessageOpen(false)}
          severity={isErrorMess ? 'error' : 'success'}
        >
          {isErrorMess ? 'Đăng ký thất bại' : 'Đăng ký thành công'}
        </Alert>
      </Snackbar>
      <TextField
        type="email"
        required
        label="Email"
        placeholder="Email"
        fullWidth
        variant="outlined"
        margin="normal"
        color="primary"
        error={Boolean(errors.email?.length)}
        helperText={errors.email?.length ? errors.email[0].message : ''}
        value={formData.email}
        onChange={(event) => setField('email', event.target.value)}
        onBlur={() => validate(formData, 'email')}
      ></TextField>
      <TextField
        type="text"
        required
        label="Tên tài khoản"
        placeholder="Tên tài khoản"
        fullWidth
        variant="outlined"
        margin="normal"
        color="primary"
        error={Boolean(errors.username?.length)}
        helperText={errors.username?.length ? errors.username[0].message : ''}
        value={formData.username}
        onChange={(event) => setField('username', event.target.value)}
        onBlur={() => validate(formData, 'username')}
      ></TextField>
      <TextField
        type="password"
        required
        label="Mật khẩu"
        placeholder="Mật khẩu"
        fullWidth
        variant="outlined"
        margin="normal"
        color="primary"
        error={Boolean(errors.password?.length)}
        helperText={errors.password?.length ? errors.password[0].message : ''}
        value={formData.password}
        onChange={(event) => setField('password', event.target.value)}
        onBlur={() => validate(formData, ['password', 'passwordConfirm'])}
      ></TextField>
      <TextField
        type="password"
        required
        label="Xác nhận mật khẩu"
        placeholder="Xác nhận mật khẩu"
        fullWidth
        variant="outlined"
        margin="normal"
        color="primary"
        error={Boolean(errors.passwordConfirm?.length)}
        helperText={
          errors.passwordConfirm?.length
            ? errors.passwordConfirm[0].message
            : ''
        }
        value={formData.passwordConfirm}
        onChange={(event) => setField('passwordConfirm', event.target.value)}
        onBlur={() => validate(formData, ['password', 'passwordConfirm'])}
      ></TextField>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        className={classes.marginTop}
        onClick={submit}
      >
        Đăng ký
      </Button>
      <Button
        fullWidth
        variant="text"
        color="primary"
        onClick={() => props.handleOpen(true)}
      >
        Đã có tài khoản? Đăng nhập!
      </Button>
    </React.Fragment>
  )
}
