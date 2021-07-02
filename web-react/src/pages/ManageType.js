import React, { useState } from 'react'
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
  Button,
  Icon,
} from '@material-ui/core'
import { useQuery, gql } from '@apollo/client'
import Actions from '../components/ManageType/Actions'
import ActionsModal from '../components/ManageType/ActionsModal'
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

const GET_TYPE = gql`
  query getTypes {
    types: Type {
      id
      name
    }
  }
`
export default function ManageType() {
  const classes = useStyles()
  const { loading, data, refetch } = useQuery(GET_TYPE)
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(20)
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState('add')
  const [currentId, setCurrentId] = useState(null)

  const addType = () => {
    setCurrentId(null)
    setAction('add')
    setOpen(true)
  }

  const editType = (id) => {
    setCurrentId(id)
    setAction('edit')
    setOpen(true)
  }

  const deleteType = (id) => {
    setCurrentId(id)
    setAction('delete')
    setOpen(true)
  }

  return (
    <>
      <Box className={classes.container}>
        <Typography variant="h2" component="h1" className={classes.pageHeader}>
          Quản lý thể loại
        </Typography>
        <Button variant="outlined" color="primary" onClick={addType}>
          <Icon>add_circle_outline</Icon>Thêm thể loại
        </Button>
        <TableContainer className={classes.tableContainer}>
          <Table aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Loading />
                  </TableCell>
                </TableRow>
              )}
              {data?.types.length > 0 &&
                data.types
                  .slice(page * perPage, (page + 1) * perPage)
                  .map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell scope="row">
                        {index + 1 + page * perPage}
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className={classes.actionsCell}>
                        <Actions
                          id={item.id}
                          editType={editType}
                          deleteType={deleteType}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              {!loading && !data?.types.length > 0 && (
                <TableRow>
                  <TableCell colSpan={3} scope="row">
                    <Typography align="center">
                      Không có thể loại nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {data?.types.length > 0 && (
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 20, 50]}
            count={data.types.length}
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
          type={data?.types.find((item) => item.id === currentId)}
          closeModal={() => setOpen(false)}
          onActionSucceed={refetch}
        />
      </Box>
    </>
  )
}
