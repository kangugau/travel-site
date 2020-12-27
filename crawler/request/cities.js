const query = `query GeoDescriptionQuery($geoId: Int!, $limit: Int!) {
  geoDescription: Mixer_getGeoDescription(request: {locationid: $geoId}) {
    title {
      localizedString
    }
    description {
      localizedString
    }
  }
  locations(locationIds: [$geoId]) {
    toolDescription: locationDescription
    name
  }
  topPhotos: PrimaryMedia_getTopPhotos(request: [
    {locationId: $geoId, length: $limit}
  ]) {
    photos {
      legacy
      photo {
        id
        photoSizes {
          url
          width
          height
        }
      }
    }
  }  
}`
const variables = {
  geoId: 293924,
  limit: 1,
}

module.exports = {
  query,
  variables,
}
