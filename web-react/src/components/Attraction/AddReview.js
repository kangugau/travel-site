import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  Modal,
  Fade,
  Backdrop,
  Paper,
  TextField,
  Button,
  FormControl,
  Box,
} from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import { useMutation, gql } from '@apollo/client'

import { required, useValidator } from '../../utils/validators'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '600px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: theme.spacing(2),
    textAlign: 'center',
  },
}))

const ADD_REVIEW_MUTATION = gql`
  mutation addReview(
    $attractionId: ID!
    $title: String!
    $text: String!
    $rating: Int!
  ) {
    CreateReview(
      attractionId: $attractionId
      title: $title
      text: $text
      rating: $rating
    ) {
      id
    }
  }
`

const RATING_LABELS = {
  1: 'Kinh khủng',
  2: 'Tồi',
  3: 'Trung bình',
  4: 'Rất tốt',
  5: 'Tuyệt vời',
}
export function AddReview(props) {
  const classes = useStyles()
  const [hoverRating, setHoverRating] = useState(5)
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    rating: 5,
  })

  const setField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }
  const rules = {
    title: [{ validator: required, message: 'Tiêu đề là bắt buộc' }],
    text: [{ validator: required, message: 'Nội dung đánh giá là bắt buộc' }],
  }

  const [addReview, { error: addReviewError }] = useMutation(
    ADD_REVIEW_MUTATION,
    {
      variables: {
        attractionId: props.attraction.id,
        title: formData.title,
        text: formData.text,
        rating: formData.rating,
      },
      ignoreResults: false,
    }
  )

  const { errors, validate } = useValidator(rules)

  const submit = async () => {
    const valid = validate(formData)
    if (!valid) return
    try {
      await addReview()
      props.onAddReview()
      props.handleClose()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <React.Fragment>
      <Modal
        className={classes.modal}
        open={props.modalOpen}
        onClose={props.handleClose}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.modalOpen}>
          <Paper className={classes.modalContent} elevation={3}>
            <Typography variant="h6">Viết đánh giá</Typography>
            <FormControl margin="normal" required>
              <Typography component="legend">
                {
                  RATING_LABELS[
                    hoverRating !== -1 ? hoverRating : formData.rating
                  ]
                }
              </Typography>
              <Rating
                name="rating"
                size="large"
                value={formData.rating}
                onChange={(event, value) => setField('rating', value)}
                onChangeActive={(event, value) => setHoverRating(value)}
              ></Rating>
            </FormControl>
            <TextField
              type="text"
              required
              label="Tiêu đề"
              fullWidth
              variant="outlined"
              margin="normal"
              color="primary"
              error={Boolean(errors.title.length)}
              helperText={errors.title.length ? errors.title[0].message : ''}
              value={formData.title}
              onChange={(event) => setField('title', event.target.value)}
              onBlur={() => validate(formData, 'title')}
            ></TextField>
            <TextField
              type="text"
              required
              label="Nội dung đánh giá"
              fullWidth
              multiline
              rows={5}
              variant="outlined"
              margin="normal"
              color="primary"
              error={Boolean(errors.text.length)}
              helperText={errors.text.length ? errors.text[0].message : ''}
              value={formData.text}
              onChange={(event) => setField('text', event.target.value)}
              onBlur={() => validate(formData, 'text')}
            ></TextField>
            {addReviewError && (
              <Box color="error.main">{addReviewError.message}</Box>
            )}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.marginTop}
              onClick={submit}
            >
              Gửi đánh giá của bạn
            </Button>
          </Paper>
        </Fade>
      </Modal>
    </React.Fragment>
  )
}
