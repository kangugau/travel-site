import React from 'react'

import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import UserList from './components/UserList'
import Nav from './components/Nav'
import Home from './pages/Home'
import City from './pages/City'
import Attraction from './pages/Attraction'

import { makeStyles, createMuiTheme } from '@material-ui/core/styles'
import { blue, deepOrange, teal } from '@material-ui/core/colors'
import {
  CssBaseline,
  Box,
  Container,
  ThemeProvider,
  withWidth,
} from '@material-ui/core'

const theme = createMuiTheme({
  palette: {
    primary: blue,
    warning: deepOrange,
    info: teal,
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
        transition: '0.25s',
      },
    },
  },
})

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
    height: '100vh',
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
              </Switch>

              <Box pt={4}>{/* <Copyright /> */}</Box>
            </Container>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}
export default withWidth()(App)
