const { gql } = require('@apollo/client')
const attractionsData = require('../../../crawler/data/attractions-hanoi.json')
const reviewsData = require('../../../crawler/data/attraction-reviews.json')

export const getSeedMutations = () => {
  const attractionMutations = generateAttractionMutations(attractionsData)
  const filterMutations = generateFilterMutations(attractionsData)
  const reviewMutations = generateReviewMutations(reviewsData)
  return { attractionMutations, filterMutations, reviewMutations }
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
            reviewId: $reviewId
            title: $title
            text: $text
            createdDate: $createdDate
            publishedDate: $publishedDate
            rating: $rating
            tripDate: $tripDate
            tripType: $tripType
          ) {
            reviewId
          }
          MergeUser(
            userId: "${user.userId}"
            displayName: "${user.displayName}"
            username: "${user.username}"
          ) {
            username
          }
          MergeReviewOwner(
            from: {userId: "${user.userId}"}
            to: {reviewId: $reviewId}
          )
          {
            from {
              userId
            }
          }
          MergeReviewAttraction(
            from: { reviewId: $reviewId }
            to: { attractionId: $attractionId }
          ) {
            from {
              reviewId
            }
            to {
              attractionId
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
        MergeCategory(categoryId: $categoryId, name: $name) {
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
        MergeType(typeId: $typeId, name: $name) {
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
        MergeTag(tagId: $tagId, name: $name) {
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
    let categoryMutations = attraction.categoryIds.map((categoryId) => {
      return {
        mutation: gql`
          mutation mergeCategories($categoryId: ID!, $attractionId: ID!) {
            MergeCategory(categoryId: $categoryId) {
              categoryId
              name
            }
            MergeAttractionCategories(
              from: { attractionId: $attractionId }
              to: { categoryId: $categoryId }
            ) {
              from {
                attractionId
              }
              to {
                categoryId
              }
            }
          }
        `,
        variables: {
          categoryId: categoryId,
          attractionId: attraction.attractionId,
        },
      }
    })

    let typeMutations = attraction.typeIds.map((typeId) => {
      return {
        mutation: gql`
          mutation mergeTypes($typeId: ID!, $attractionId: ID!) {
            MergeType(typeId: $typeId) {
              typeId
              name
            }
            MergeAttractionTypes(
              from: { attractionId: $attractionId }
              to: { typeId: $typeId }
            ) {
              from {
                attractionId
              }
              to {
                typeId
              }
            }
          }
        `,
        variables: {
          typeId: typeId,
          attractionId: attraction.attractionId,
        },
      }
    })

    let tagMutations = attraction.tagIds.map((tagId) => {
      return {
        mutation: gql`
          mutation mergeTags($tagId: ID!, $attractionId: ID!) {
            MergeTag(tagId: $tagId) {
              tagId
              name
            }
            MergeAttractionTags(
              from: { attractionId: $attractionId }
              to: { tagId: $tagId }
            ) {
              from {
                attractionId
              }
              to {
                tagId
              }
            }
          }
        `,
        variables: {
          tagId: tagId,
          attractionId: attraction.attractionId,
        },
      }
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
            attractionId: $attractionId
            name: $name
            location: $location
            address: $address
          ) {
            attractionId
            name
          }
        }
      `,
      variables: variables,
      categoryMutations,
      typeMutations,
      tagMutations,
    }
  })
  return attractionMutations
}
