const query = `query GeoDescriptionQuery($geoId: Int!) {
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
}`
const variables = {
  geoId: 293924,
}

module.exports = {
  query,
  variables,
}
