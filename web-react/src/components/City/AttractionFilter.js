import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Paper,
  FormControlLabel,
  FormControl,
  FormGroup,
  Checkbox,
  Divider,
  TextField,
} from '@material-ui/core'
import { imageContainer, attractionRating } from '../../styles'
import { gql, useQuery } from '@apollo/client'
import clsx from 'clsx'
import { nonAccentVietnamese } from '../../utils/text'

const GET_CATEGORIES = gql`
  query getCategories {
    categories: Category {
      id
      name
    }
  }
`

const GET_TYPES = gql`
  query getTyes {
    types: Type {
      id
      name
    }
  }
`

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 2, 2, 0),
    marginTop: theme.spacing(2),
  },
  attractionImg: {
    width: '100%',
  },
  filterGroup: {
    marginTop: theme.spacing(1),
    maxHeight: '200px',
    overflowY: 'auto',
    flexWrap: 'nowrap',
  },
  filterLabel: {
    fontWeight: '500',
    color: 'inherit',
    fontSize: theme.typography.h6.fontSize,
  },
  spaceLeft: {
    paddingLeft: theme.spacing(2),
  },
  seeMore: {
    cursor: 'pointer',
    fontWeight: '500',
    textDecoration: 'underline',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  imageContainer,
  attractionRating,
}))

export default function AttractionFilter(props) {
  const classes = useStyles()
  const { data: categoryData } = useQuery(GET_CATEGORIES)
  const { data: typeData } = useQuery(GET_TYPES)

  const [cateKeyword, setCateKeyword] = useState('')
  const onCateKeywordChange = (event) => {
    setCateKeyword(event.target.value)
  }
  let filteredCate = []
  if (categoryData) {
    filteredCate = categoryData.categories.filter(
      (category) =>
        nonAccentVietnamese(category?.name).indexOf(
          nonAccentVietnamese(cateKeyword)
        ) != -1
    )
  }
  const isCateChecked = (id) => {
    return props.selectedCates?.indexOf(id) !== -1
  }
  const onCateCheckboxChange = (checked, id) => {
    let temp = [...props.selectedCates]
    if (checked) {
      temp.push(id)
    } else {
      temp.splice(temp.indexOf(id), 1)
    }
    props.onCatesChange(temp)
  }

  const [typeKeyword, setTypeKeyword] = useState('')
  const onTypeKeywordChange = (event) => {
    setTypeKeyword(event.target.value)
  }
  let filteredType = []
  if (typeData) {
    filteredType = typeData.types.filter(
      (type) =>
        nonAccentVietnamese(type?.name).indexOf(
          nonAccentVietnamese(typeKeyword)
        ) != -1
    )
  }
  const isTypeChecked = (id) => {
    return props.selectedCates?.indexOf(id) !== -1
  }
  const onTypeCheckboxChange = (checked, id) => {
    let temp = [...props.selectedTypes]
    if (checked) {
      temp.push(id)
    } else {
      temp.splice(temp.indexOf(id), 1)
    }
    props.onTypesChange(temp)
  }

  return (
    <Paper variant="outlined" className={classes.root}>
      <React.Fragment>
        <div
          component="legend"
          className={clsx(classes.filterLabel, classes.spaceLeft)}
        >
          Danh mục
        </div>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          value={cateKeyword}
          onChange={onCateKeywordChange}
          placeholder="Tìm danh mục"
          className={classes.spaceLeft}
        ></TextField>
        {categoryData && (
          <FormControl fullWidth>
            <FormGroup className={clsx(classes.filterGroup, classes.spaceLeft)}>
              {props.selectedCates?.length > 0 &&
                categoryData.categories
                  .filter(
                    (category) =>
                      props.selectedCates.indexOf(category.id) !== -1
                  )
                  .map((category) => (
                    <FormControlLabel
                      key={category.id}
                      control={
                        <Checkbox
                          checked={true}
                          onChange={(event, checked) => {
                            onCateCheckboxChange(checked, category.id)
                          }}
                        />
                      }
                      label={category.name}
                    />
                  ))}

              {filteredCate
                .filter(
                  (category) => props.selectedCates.indexOf(category.id) === -1
                )
                .map((category) => {
                  return (
                    <FormControlLabel
                      key={category.id}
                      control={
                        <Checkbox
                          checked={isCateChecked(category.id)}
                          onChange={(event, checked) => {
                            onCateCheckboxChange(checked, category.id)
                          }}
                        />
                      }
                      label={category.name}
                    />
                  )
                })}
            </FormGroup>
          </FormControl>
        )}
      </React.Fragment>
      <Divider
        className={classes.divider}
        style={{ marginLeft: '16px' }}
      ></Divider>
      <React.Fragment>
        <div
          component="legend"
          className={clsx(classes.filterLabel, classes.spaceLeft)}
        >
          Thể loại
        </div>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          value={typeKeyword}
          onChange={onTypeKeywordChange}
          placeholder="Tìm thể loại"
          className={classes.spaceLeft}
        ></TextField>
        {typeData && (
          <FormControl fullWidth>
            <FormGroup className={clsx(classes.filterGroup, classes.spaceLeft)}>
              {props.selectedTypes?.length > 0 &&
                typeData.categories
                  .filter((type) => props.selectedTypes.indexOf(type.id) !== -1)
                  .map((type) => (
                    <FormControlLabel
                      key={type.id}
                      control={
                        <Checkbox
                          checked={true}
                          onChange={(event, checked) => {
                            onTypeCheckboxChange(checked, type.id)
                          }}
                        />
                      }
                      label={type.name}
                    />
                  ))}

              {filteredType
                .filter((type) => props.selectedCates.indexOf(type.id) === -1)
                .map((type) => {
                  return (
                    <FormControlLabel
                      key={type.id}
                      control={
                        <Checkbox
                          checked={isTypeChecked(type.id)}
                          onChange={(event, checked) => {
                            onTypeCheckboxChange(checked, type.id)
                          }}
                        />
                      }
                      label={type.name}
                    />
                  )
                })}
            </FormGroup>
          </FormControl>
        )}
      </React.Fragment>
    </Paper>
  )
}
