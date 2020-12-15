const query = `query LocationTagsQuery($locationIds: [Int!]!, $minScore: Int!) {
  locationTags(locationIds: $locationIds, minScore: $minScore) {
    tagName
    tagId
  }
}`
const variables = {
  locationIds: [],
  minScore: 79,
}

module.exports = {
  query,
  variables,
}
