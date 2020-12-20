const { gql } = require('@apollo/client')
const attractionsData = require('../../../crawler/data/attractions-hanoi.json')
const reviewsData = require('../../../crawler/data/attraction-reviews.json')

export const getSeedMutations = () => {
  const {
    attractionMutations,
    categoryMutations,
    typeMutations,
    tagMutations,
  } = generateAttractionMutations(attractionsData)
  const filterMutations = generateFilterMutations(attractionsData)
  const reviewMutations = generateReviewMutations(reviewsData)
  const thumbnailMutations = generateThumbnailMutations(attractionsData)
  const reviewPhotoMutations = generateReviewPhotoMutations(reviewsData)
  return {
    attractionMutations,
    categoryMutations,
    typeMutations,
    tagMutations,
    filterMutations,
    reviewMutations,
    thumbnailMutations,
    reviewPhotoMutations,
  }
}

const generateReviewMutations = () => {
  return reviewsData.map((location) => {
    const reviews = location.reviewListPage.reviews
    const attractionId = location.locationId
    const batch = reviews.map((review) => {
      const createdDate = new Date(review.createdDate)
      const publishedDate = new Date(review.publishedDate)
      const tripDate = review.tripInfo
        ? new Date(review.tripInfo.stayDate)
        : null
      const user = review.userProfile
      const mutation = gql`
        mutation mergeReviews(
          $reviewId: ID!
          $attractionId: ID!
          $title: String
          $text: String
          $createdDate: _Neo4jDateInput
          $publishedDate: _Neo4jDateInput
          $rating: Int!
          $tripDate: _Neo4jDateInput
          $tripType: String
        ) {
          MergeReview(
            id: $reviewId
            title: $title
            text: $text
            createdDate: $createdDate
            publishedDate: $publishedDate
            rating: $rating
            tripDate: $tripDate
            tripType: $tripType
          ) {
            id
          }
          MergeUser(
            id: "${user.userId}"
            displayName: "${user.displayName}"
            username: "${user.username}"
          ) {
            username
          }
          MergeReviewOwner(
            from: {id: "${user.userId}"}
            to: {id: $reviewId}
          )
          {
            from {
              id
            }
          }
          MergeReviewAttraction(
            from: { id: $reviewId }
            to: { id: $attractionId }
          ) {
            from {
              id
            }
            to {
              id
            }
          }
        }
      `
      const variables = {
        reviewId: review.id,
        attractionId: attractionId,
        title: review.title,
        text: review.text,
        createdDate: {
          year: createdDate.getFullYear(),
          month: createdDate.getMonth() + 1,
          day: createdDate.getDate(),
        },
        publishedDate: {
          year: publishedDate.getFullYear(),
          month: publishedDate.getMonth() + 1,
          day: publishedDate.getDate(),
        },
        rating: review.rating,
        tripDate: tripDate
          ? {
              year: tripDate.getFullYear(),
              month: tripDate.getMonth() + 1,
              day: tripDate.getDate(),
            }
          : null,
        tripType: review?.tripInfo?.tripType,
      }
      return { mutation, variables }
    })
    return batch
  })
}

const generateFilterMutations = (data) => {
  const filters = data.filters
  const categories = filters.find(
    (filter) => filter.filterType === 'ATTRACTION_CATEGORY'
  ).choices
  const categoryMutations = categories.map((category) => {
    const mutation = gql`
      mutation mergeCategories($categoryId: ID!, $name: String) {
        MergeCategory(id: $categoryId, name: $name) {
          name
        }
      }
    `
    return {
      mutation,
      variables: { categoryId: category.value, name: category.label },
    }
  })
  const types = filters.find(
    (filter) => filter.filterType === 'ATTRACTION_TYPE'
  ).choices
  const typeMutations = types.map((type) => {
    const mutation = gql`
      mutation mergeTypes($typeId: ID!, $name: String) {
        MergeType(id: $typeId, name: $name) {
          name
        }
      }
    `
    return {
      mutation,
      variables: { typeId: type.value, name: type.label },
    }
  })
  const tags = filters.find((filter) => filter.filterType === 'ATTRACTION_TAG')
    .choices
  const tagMutations = tags.map((tag) => {
    const mutation = gql`
      mutation mergeTags($tagId: ID!, $name: String) {
        MergeTag(id: $tagId, name: $name) {
          name
        }
      }
    `
    return {
      mutation,
      variables: { tagId: tag.value, name: tag.label },
    }
  })
  return { categoryMutations, typeMutations, tagMutations }
}

const generateAttractionMutations = (data) => {
  const attractions = data.attractions
  const categoryMutations = []
  const typeMutations = []
  const tagMutations = []
  const attractionMutations = attractions.map((attraction) => {
    // const attractionCategories = attractions.categoryIds
    let variables = {
      attractionId: attraction.attractionId,
      name: attraction.location.name,
      address: attraction.location.localizedStreetAddress.fullAddress,
    }
    if (attraction.longitude && attraction.latitude) {
      variables.location = {
        longitude: attraction.longitude,
        latitude: attraction.latitude,
      }
    }
    attraction.categoryIds.forEach((categoryId) => {
      categoryMutations.push({
        mutation: gql`
          mutation mergeCategories($categoryId: ID!, $attractionId: ID!) {
            MergeCategory(id: $categoryId) {
              id
              name
            }
            MergeAttractionCategories(
              from: { id: $attractionId }
              to: { id: $categoryId }
            ) {
              from {
                id
              }
              to {
                id
              }
            }
          }
        `,
        variables: {
          categoryId: categoryId,
          attractionId: attraction.attractionId,
        },
      })
    })

    attraction.typeIds.forEach((typeId) => {
      typeMutations.push({
        mutation: gql`
          mutation mergeTypes($typeId: ID!, $attractionId: ID!) {
            MergeType(id: $typeId) {
              id
              name
            }
            MergeAttractionTypes(
              from: { id: $attractionId }
              to: { id: $typeId }
            ) {
              from {
                id
              }
              to {
                id
              }
            }
          }
        `,
        variables: {
          typeId: typeId,
          attractionId: attraction.attractionId,
        },
      })
    })

    attraction.tagIds.forEach((tagId) => {
      tagMutations.push({
        mutation: gql`
          mutation mergeTags($tagId: ID!, $attractionId: ID!) {
            MergeTag(id: $tagId) {
              id
              name
            }
            MergeAttractionTags(
              from: { id: $attractionId }
              to: { id: $tagId }
            ) {
              from {
                id
              }
              to {
                id
              }
            }
          }
        `,
        variables: {
          tagId: tagId,
          attractionId: attraction.attractionId,
        },
      })
    })

    return {
      mutation: gql`
        mutation mergeAttractions(
          $attractionId: ID!
          $name: String
          $location: _Neo4jPointInput
          $address: String
        ) {
          MergeAttraction(
            id: $attractionId
            name: $name
            location: $location
            address: $address
          ) {
            id
            name
          }
        }
      `,
      variables: variables,
    }
  })
  return { attractionMutations, categoryMutations, typeMutations, tagMutations }
}

const generateThumbnailMutations = (data) => {
  // attractions's thumbnail
  const attractions = data.attractions
  return attractions
    .map((attraction) => {
      const photoList = attraction.location.thumbnail?.photoSizes
      if (photoList) {
        const { url, width, height } = photoList[photoList.length - 1]
        return {
          mutation: gql`
            mutation mergePhotos(
              $url: String!
              $width: Int
              $height: Int
              $attractionId: ID!
            ) {
              MergePhoto(url: $url, width: $width, height: $height) {
                url
              }
              MergeAttractionThumbnail(
                from: { id: $attractionId }
                to: { url: $url }
              ) {
                from {
                  id
                }
                to {
                  url
                }
              }
            }
          `,
          variables: {
            url,
            width: parseInt(width),
            height: parseInt(height),
            attractionId: attraction.attractionId,
          },
        }
      }
      return
    })
    .filter(Boolean)
}

const generateReviewPhotoMutations = (data) => {
  const mutations = []
  data.forEach((location) => {
    const reviews = location.reviewListPage.reviews
    reviews.forEach((review) => {
      review.photos.forEach(({ photoSizes }) => {
        // console.log(photoSizes.length)
        if (photoSizes.length) {
          const { url, width, height } = photoSizes[photoSizes.length - 1]
          mutations.push({
            mutation: gql`
              mutation mergeReviewPhotos(
                $url: String!
                $width: Int
                $height: Int
                $reviewId: ID!
              ) {
                MergePhoto(url: $url, width: $width, height: $height) {
                  url
                }
                MergeReviewPhotos(from: { id: $reviewId }, to: { url: $url }) {
                  from {
                    id
                  }
                  to {
                    url
                  }
                }
              }
            `,
            variables: {
              url,
              width: parseInt(width),
              height: parseInt(height),
              reviewId: review.id,
            },
          })
        }
      })
    })
  })
  return mutations
}
