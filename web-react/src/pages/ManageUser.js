import React, { useState, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Icon,
  TextField,
  InputAdornment,
} from '@material-ui/core'
import { useQuery, gql } from '@apollo/client'
import Actions from '../components/ManageUser/Actions'
import ActionsModal from '../components/ManageUser/ActionsModal'
import Loading from '../components/Loading'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    // zIndex: 3,
  },
  container: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  tableContainer: {
    maxHeight: '400px',
  },
  pageHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    fontWeight: '500',
    textAlign: 'center',
  },
  actionsCell: {
    width: '125px',
  },
}))

const GET_USER = gql`
  query getUsers($first: Int, $offset: Int, $filter: _UserFilter) {
    users: User(first: $first, offset: $offset, filter: $filter) {
      id
      username
      email
      role
    }
    resultsCount: UserCount(filter: $filter) {
      resultsCount
    }
  }
`
export default function ManageUser() {
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(20)
  const inputEl = useRef(null)
  const [filter, setFilter] = useState({})

  console.log('render')

  const onKeyUp = (event) => {
    if (event.keyCode === 13) {
      setFilter({ username_contains: inputEl.current.value })
    }
  }

  const { loading, data, refetch } = useQuery(GET_USER, {
    variables: {
      first: perPage || 0,
      offset: page * perPage,
      filter,
    },
  })
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState('add')
  const [currentId, setCurrentId] = useState(null)

  const editUser = (id) => {
    setCurrentId(id)
    setAction('edit')
    setOpen(true)
  }

  const deleteUser = (id) => {
    setCurrentId(id)
    setAction('delete')
    setOpen(true)
  }

  return (
    <>
      <Box className={classes.container}>
        <Typography variant="h2" component="h1" className={classes.pageHeader}>
          Quản lý người dùng
        </Typography>
        <Box paddingY={1}>
          <TextField
            inputRef={inputEl}
            variant="outlined"
            size="small"
            InputProps={{
              placeholder: 'Tìm kiếm người dùng',
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>search</Icon>
                </InputAdornment>
              ),
            }}
            onKeyUp={onKeyUp}
          ></TextField>
        </Box>
        <TableContainer className={classes.tableContainer}>
          <Table aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Loading />
                  </TableCell>
                </TableRow>
              )}
              {data?.users.length > 0 &&
                data.users.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell scope="row">
                      {index + 1 + page * perPage}
                    </TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell className={classes.actionsCell}>
                      <Actions
                        id={item.id}
                        editUser={editUser}
                        deleteUser={deleteUser}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              {!loading && !data?.users.length > 0 && (
                <TableRow>
                  <TableCell colSpan={5} scope="row">
                    <Typography align="center">
                      Không có người dùng nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {data?.users.length > 0 && (
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 20, 50]}
            count={data.resultsCount.resultsCount}
            rowsPerPage={perPage}
            page={page}
            SelectProps={{
              inputProps: { 'aria-label': 'rows per page' },
              native: true,
            }}
            onChangePage={(event, page) => {
              setPage(page)
            }}
            onChangeRowsPerPage={(event) => {
              setPerPage(event.target.value)
            }}
          />
        )}
        <ActionsModal
          open={open}
          action={action}
          user={data?.users.find((item) => item.id === currentId)}
          closeModal={() => setOpen(false)}
          onActionSucceed={refetch}
        />
      </Box>
    </>
  )
}
