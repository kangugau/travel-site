import React from 'react'

export const AuthContext = React.createContext({
  user: null,
  modalOpen: false,
  isLoginModal: false,
  handleOpen: () => {},
  handleClose: () => {},
})
