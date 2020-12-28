import React from 'react'

import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import UserList from './components/UserList'
import Nav from './components/Nav'
import Home from './pages/Home'
import City from './pages/City'
import Attraction from './pages/Attraction'
import User from './pages/User'

import {
  makeStyles,
  createMuiTheme,
  responsiveFontSizes,
} from '@material-ui/core/styles'
import { blue, teal, grey } from '@material-ui/core/colors'
import { CssBaseline, Container, ThemeProvider } from '@material-ui/core'

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
  },
}))

function App() {
  const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <Nav></Nav>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/businesses" component={UserList} />
                <Route exact path="/users" component={UserList} />
                <Route exact path="/city/:id" component={City} />
                <Route exact path="/attraction/:id" component={Attraction} />
                <Route exact path="/user/:id" component={User} />
              </Switch>

              {/* <Box pt={4}><Copyright /></Box> */}
            </Container>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}
export default App
