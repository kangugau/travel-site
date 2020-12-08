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

getSeedMutations()
