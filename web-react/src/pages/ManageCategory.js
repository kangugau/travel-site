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
import CategoryActions from '../components/ManageCategory/CategoryActions'
import ActionsModal from '../components/ManageCategory/ActionsModal'
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

const GET_CATEGORIES = gql`
  query getCategories {
    categories: Category {
      id
      name
    }
  }
`
export default function ManageCategory() {
  const classes = useStyles()
  const { loading, data, refetch } = useQuery(GET_CATEGORIES)
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState('add')
  const [currentId, setCurrentId] = useState(null)

  const addCategory = () => {
    setCurrentId(null)
    setAction('add')
    setOpen(true)
  }

  const editCategory = (id) => {
    setCurrentId(id)
    setAction('edit')
    setOpen(true)
  }

  const deleteCategory = (id) => {
    setCurrentId(id)
    setAction('delete')
    setOpen(true)
  }

  return (
    <>
      <Box className={classes.container}>
        <Typography variant="h2" component="h1" className={classes.pageHeader}>
          Quản lý danh mục
        </Typography>
        <Button variant="outlined" color="primary" onClick={addCategory}>
          <Icon>add_circle_outline</Icon>Thêm danh mục
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
              {data?.categories.length &&
                data.categories.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell scope="row">{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className={classes.actionsCell}>
                      <CategoryActions
                        id={item.id}
                        editCategory={editCategory}
                        deleteCategory={deleteCategory}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              {!loading && !data?.categories.length && (
                <TableRow>
                  <TableCell colSpan={3} scope="row">
                    <Typography align="center">
                      Không có danh mục nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {data?.categories.length && (
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 20]}
            count={data.categories.length}
            rowsPerPage={20}
            page={page}
            SelectProps={{
              inputProps: { 'aria-label': 'rows per page' },
              native: true,
            }}
            onChangePage={(event, page) => {
              setPage(page)
            }}
          />
        )}
        <ActionsModal
          open={open}
          action={action}
          category={data?.categories.find((item) => item.id === currentId)}
          closeModal={() => setOpen(false)}
          onActionSucceed={refetch}
        />
      </Box>
    </>
  )
}
