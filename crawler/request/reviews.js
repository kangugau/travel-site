const query = `query ReviewListQuery($locationIds: [Int!]!, $offset: Int, $limit: Int, $filters: [FilterConditionInput!], $prefs: ReviewListPrefsInput, $initialPrefs: ReviewListPrefsInput, $filterCacheKey: String, $prefsCacheKey: String, $keywordVariant: String!, $needKeywords: Boolean = true) {
  cachedFilters: personalCache(key: $filterCacheKey)
  cachedPrefs: personalCache(key: $prefsCacheKey)
  locations(locationIds: $locationIds) {
    locationId
    name
    placeType
    keywords(variant: $keywordVariant) @include(if: $needKeywords) {
      keywords {
        keyword
      }
    }
    ... on LocationInformation {
      locationId
      accommodationCategory
      currentUserOwnerStatus {
        isValid
      }
      url
    }
    reviewListPage(page: {offset: $offset, limit: $limit}, filters: $filters, prefs: $prefs, initialPrefs: $initialPrefs, filterCacheKey: $filterCacheKey, prefsCacheKey: $prefsCacheKey) {
      totalCount
      preferredReviewIds
      reviews {
        ... on Review {
          id
          createdDate
          publishedDate
          title
          text
          rating
          alertStatus
          roomTip
          helpfulVotes
          photoIds
          status
          additionalRatings {
            rating
            ratingLabel
          }
          tripInfo {
            stayDate
            tripType
          }
          userProfile {
            userId: id
            displayName
            username
            avatar {
              id
              photoSizes {
                url
                width
                height
              }
            }
            hometown {
              fallbackString
              location {
                locationId
                additionalNames {
                  long
                }
                name
              }
            }
          }
          photos {
            id
            statuses
            photoSizes {
              url
              width
              height
            }
          }
        }
      }
    }
  }
}`

const variables = {
  locationIds: [317503],
  offset: 0,
  filters: [{ axis: 'LANGUAGE', selections: ['vi'] }],
  prefs: null,
  initialPrefs: {},
  limit: 0,
  filterCacheKey: null,
  prefsCacheKey: 'locationReviewPrefs',
  needKeywords: false,
  keywordVariant: 'location_keywords_v2_llr_order_30_en',
}

const cityIds = {
  hanoi: 293924,
}
module.exports = {
  query,
  variables,
  cityIds,
}
