const query = `query GetAttractions($categories: [Int], $characterLimit: Long, $client: Personalization_ReviewSnippetRequestClient, $currencyCode: String, $filterId: String, $geoId: Int, $language: String, $excludeSuppliers: Boolean, $limit: Int, $offset: Int, $sortOrder: ExpPresentationService_SortOrder, $neighborhoods: [Int], $types: [Int], $tags: [Int], $waypoint: Int, $excludeDefault: Boolean, $isApolloTestActive: Boolean!) {
  attractionsResponse: ExpPresentationService_getAttractions(request: [{categories: $categories, currencyCode: $currencyCode, facetsEnabled: [ATTRACTION_AIRPORT_ID, ATTRACTION_CATEGORY, ATTRACTION_NEIGHBORHOOD, ATTRACTION_THEME_PARK_ID, ATTRACTION_TYPE, ATTRACTION_TAG], excludeSuppliers: $excludeSuppliers, geoId: $geoId, limit: $limit, neighborhoods: $neighborhoods, offset: $offset, sortOrder: $sortOrder, tags: $tags, types: $types, waypoint: $waypoint}]) {
    attractions {
      attractionId: locationId
      attractionProductListUrl {
        url @encode
      }
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
  count
  value: filter
  label
}

fragment NeighborhoodFilter on ExpPresentationService_AttractionLocationFilter {
  count
  value: filter
  location {
    name
  }
}

fragment TagFilter on ExpPresentationService_AttractionTagFilter {
  count
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

const cityIds = {
  hanoi: 293924,
}
module.exports = {
  query,
  variables,
  cityIds,
}
