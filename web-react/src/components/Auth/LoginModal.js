import React, { useState } from 'react'
import { Button, TextField, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useMutation, gql } from '@apollo/client'
import { email, required, useValidator } from '../../utils/validators'

const useStyles = makeStyles((theme) => ({
  marginTop: {
    marginTop: theme.spacing(3),
  },
}))

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    LoginUser(email: $email, password: $password) {
      token
    }
  }
`

export default function LoginModal(props) {
  const classes = useStyles()
  const [formData, setFormData] = useState({ email: '', password: '' })
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
    password: [{ validator: required, message: 'Mật khẩu là bắt buộc' }],
  }
  const { errors, hasErr, validate } = useValidator(rules)
  const [login, { error: loginError }] = useMutation(LOGIN, {
    variables: {
      email: formData.email,
      password: formData.password,
    },
    ignoreResults: false,
  })
  const submit = async () => {
    validate(formData)
    if (hasErr()) return
    try {
      console.log('submit')
      let data = await login()
      console.log(data)
      localStorage.setItem('token', data.data.LoginUser.token)
      props.handleClose()
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <React.Fragment>
      {loginError && (
        <Box color="error.main">Tài khoản hoặc mật khẩu không đúng</Box>
      )}
      <TextField
        type="email"
        required
        label="Email"
        placeholder="Email"
        fullWidth
        variant="outlined"
        margin="normal"
        color="primary"
        error={Boolean(errors.email.length)}
        helperText={errors.email.length ? errors.email[0].message : ''}
        value={formData.email}
        onChange={(event) => setField('email', event.target.value)}
        onBlur={() => validate(formData, 'email')}
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
        error={Boolean(errors.password.length)}
        helperText={errors.password.length ? errors.password[0].message : ''}
        value={formData.password}
        onChange={(event) => setField('password', event.target.value)}
        onBlur={() => validate(formData, 'password')}
      ></TextField>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        className={classes.marginTop}
        onClick={submit}
      >
        Đăng nhập
      </Button>
      <Button
        fullWidth
        variant="text"
        color="primary"
        onClick={() => props.handleOpen(false)}
        // className={classes.marginTop}
      >
        Chưa có tài khoản? Đăng ký ngay!
      </Button>
    </React.Fragment>
  )
}
