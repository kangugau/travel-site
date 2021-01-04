import React from 'react'

export const AuthModalContext = React.createContext({
  modalOpen: false,
  isLoginModal: false,
  handleOpen: () => {},
  handleClose: () => {},
})
