import React, { useState } from 'react'

import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import Nav from './components/Nav'
import Home from './pages/Home'
import City from './pages/City'
import Attraction from './pages/Attraction'
import User from './pages/User'

import { AuthModalContext } from './contexts/AuthModalContext'

import {
  makeStyles,
  createMuiTheme,
  responsiveFontSizes,
} from '@material-ui/core/styles'
import { blue, teal, grey } from '@material-ui/core/colors'
import {
  CssBaseline,
  Container,
  ThemeProvider,
  Typography,
} from '@material-ui/core'

import moment from 'moment'
import 'moment/locale/vi'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

moment.locale('vi')

let theme = createMuiTheme({
  palette: {
    primary: blue,
    info: teal,
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
        transition: '0.25s',
      },
    },
    MuiCssBaseline: {
      '@global': {
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: grey[300],
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb': {
          background: grey[400],
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: grey[500],
        },
      },
    },
    MuiIcon: {
      root: {
        verticalAlign: 'middle',
      },
    },
    MuiContainer: {
      root: {
        '@media (max-width: 600px)': {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
  },
  typography: {
    fontSize: 12,
  },
})
theme = responsiveFontSizes(theme)

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  title: {
    color: '#000000',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    '@media (max-width: 600px)': {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  },
}))

function App() {
  const classes = useStyles()
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoginModal, setIsLoginModal] = useState(false)
  const handleOpen = (isLoginModal) => {
    setIsLoginModal(isLoginModal)
    setModalOpen(true)
  }
  const handleClose = () => {
    setModalOpen(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthModalContext.Provider
          value={{ modalOpen, isLoginModal, handleOpen, handleClose }}
        >
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Typography component="div" className={classes.root}>
              <CssBaseline />
              <Nav></Nav>
              <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/city/:id" component={City} />
                    <Route
                      exact
                      path="/attraction/:id"
                      component={Attraction}
                    />
                    <Route exact path="/user/:id" component={User} />
                  </Switch>

                  {/* <Box pt={4}><Copyright /></Box> */}
                </Container>
              </main>
            </Typography>
          </MuiPickersUtilsProvider>
        </AuthModalContext.Provider>
      </Router>
    </ThemeProvider>
  )
}
export default App
