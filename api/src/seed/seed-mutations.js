const { gql } = require('@apollo/client')
const data = require('../../../crawler/data/attractions-hanoi.json')

export const getSeedMutations = () => {
  const mutations = generateMutations(data)
  // const mutations = generateMutations(records)
  return mutations
}
const generateMutations = (data) => {
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
  // const categories = data.filters.find(
  //   (filter) => filter.filterType === 'ATTRACTION_CATEGORY'
  // ).choices
  // const categoryMutations = categories.map((category) => {
  //   return {
  //     mutation: gql`
  //       mutation mergeCategories($categoryId: ID!, $name: String) {
  //         mergeCategory(categoryId: $categoryId, name: $name) {
  //           categoryId
  //           name
  //         }
  //       }
  //     `,
  //     variables: {
  //       categoryId: category.value,
  //       name: category.label,
  //     },
  //   }
  // })
  return attractionMutations
}
