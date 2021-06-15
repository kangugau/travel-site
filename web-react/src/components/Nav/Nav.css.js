import { deepOrange } from '@material-ui/core/colors'

export default (theme) => ({
  toolbar: {
    justifyContent: 'space-between',
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    '@media only screen and (max-width: 600px)': {
      flexGrow: 'unset',
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#ffffff',
  },
  title: {
    color: '#000000',
  },
  drawer: {
    width: '250px',
    maxWidth: '90vw',
    padding: theme.spacing(2),
  },
  appBarImage: {
    maxHeight: '50px',
    '@media (min-width: 600px)': {
      paddingRight: '20px',
    },
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '350px',
    maxWidth: '90vw',
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  avatar: {
    padding: theme.spacing(1),
  },
  seperator: {
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.grey[500],
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  verticalAlignMiddle: {
    verticalAlign: 'middle',
  },
  iconButton: {
    marginRight: theme.spacing(0.5),
  },
  navItem: {
    marginRight: theme.spacing(2),
  },
  displayName: {
    color: theme.palette.text.primary,
    marginLeft: theme.spacing(1),
  },
})
