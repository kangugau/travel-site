const query = `query GetAttractions($categories: [Int], $characterLimit: Long, $client: Personalization_ReviewSnippetRequestClient, $currencyCode: String, $filterId: String, $geoId: Int, $language: String, $excludeSuppliers: Boolean, $limit: Int, $offset: Int, $sortOrder: ExpPresentationService_SortOrder, $neighborhoods: [Int], $types: [Int], $tags: [Int], $waypoint: Int, $excludeDefault: Boolean, $isApolloTestActive: Boolean!) {
  attractionsResponse: ExpPresentationService_getAttractions(request: [{categories: $categories, currencyCode: $currencyCode, facetsEnabled: [ATTRACTION_AIRPORT_ID, ATTRACTION_CATEGORY, ATTRACTION_NEIGHBORHOOD, ATTRACTION_THEME_PARK_ID, ATTRACTION_TYPE, ATTRACTION_TAG], excludeSuppliers: $excludeSuppliers, geoId: $geoId, limit: $limit, neighborhoods: $neighborhoods, offset: $offset, sortOrder: $sortOrder, tags: $tags, types: $types, waypoint: $waypoint}]) {
    attractions {
      attractionId: locationId
      categoryIds
      typeIds
      tagIds
      latitude
      longitude
      location {
        name
        url
        thumbnail {
          photoSizes {
            height
            width
            url
          }
        }
        localizedStreetAddress @include(if: $isApolloTestActive) {
          fullAddress
        }
        locationV2 @include(if: $isApolloTestActive) {
          hoursOfOperation {
            isOpenNow
            openHoursTodayText
          }
        }
      }
      productCount
      reviewCount
      reviewScore
      name: title
      reviewSnippets(characterLimit: $characterLimit, client: $client, excludeDefault: $excludeDefault, filterId: $filterId, language: $language) {
        reviewSnippets {
          text
          review {
            absoluteUrl
            userId
            username
          }
        }
      }
    }
    filters {
      filterType
      label
      choices: filters {
        ...TaxonomyFilter
        ...NeighborhoodFilter
        ...TagFilter
      }
    }
    totalResults
  }
}

fragment TaxonomyFilter on ExpPresentationService_AttractionTaxonomyFilter {
  value: filter
  label
}

fragment NeighborhoodFilter on ExpPresentationService_AttractionLocationFilter {
  value: filter
  location {
    name
  }
}

fragment TagFilter on ExpPresentationService_AttractionTagFilter {
  value: filter
  tagId
  label
}`

const variables = {
  currencyCode: 'VND',
  excludeSuppliers: true,
  geoId: 293924,
  offset: 0,
  limit: 0,
  sortOrder: 'TRAVELER_FAVORITE_V2',
  categories: [],
  tags: [],
  types: [],
  neighborhoods: [],
  language: 'vi',
  excludeDefault: true,
  client: 'ATTRACTIONS',
  characterLimit: 60,
  isApolloTestActive: true,
}

module.exports = {
  query,
  variables,
}
