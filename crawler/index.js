const axios = require('axios')
const request = require('./request')
const graphqlUrl = 'https://www.tripadvisor.com.vn/data/graphql'

const fs = require('fs')

async function getCityDesc(city = 'hanoi') {
  const { query, variables } = request.cities
  const cityId = request.cityIds[city]
  variables.geoId = cityId
  try {
    const response = await axios.post(graphqlUrl, {
      query: query,
      variables: variables,
    })
    const newData = response.data.data
    let oldData = {}
    if (fs.existsSync('./data/cities.json')) {
      oldData = fs.readFileSync('./data/cities.json', 'utf8')
      oldData = JSON.parse(oldData)
    }
    const data = {
      ...oldData,
      [city]: {
        id: cityId,
        name: newData.locations[0].name,
        descriptionTitle: newData.geoDescription?.title.localizedString,
        descriptionDetail: newData.geoDescription?.description.localizedString,
        descriptionAlt: newData.locations[0].toolDescription,
        thumbnail: newData.topPhotos[0].photos[0].photo.photoSizes.pop(),
      },
    }
    fs.writeFile(`./data/cities.json`, JSON.stringify(data, null, 2), (err) => {
      console.log(err)
    })
    return newData
  } catch (error) {
    console.log(error)
  }
}

async function getAttractions(city = 'hanoi') {
  const query = request.attractions.query
  let variables = request.attractions.variables
  const cityIds = request.cityIds
  variables.geoId = cityIds[city]
  let total = 0
  try {
    const totalRes = await axios.post(graphqlUrl, {
      query: query,
      variables: variables,
    })

    total = totalRes.data.data.attractionsResponse[0].totalResults
    variables.limit = total
    const attractionsResponse = await axios.post(graphqlUrl, {
      query: query,
      variables: variables,
    })
    const attractions = attractionsResponse.data.data.attractionsResponse[0]
    fs.writeFile(
      `./data/attractions-${city}.json`,
      JSON.stringify(attractions, null, 2),
      (err) => {
        console.log(err)
      }
    )
    return attractions
  } catch (error) {
    console.log(error)
  }
}

async function getReviews(attractionIds = [317503], city = 'hanoi') {
  const MAX_PER_REQUEST = 20
  const query = request.reviews.query
  let variables = request.reviews.variables
  let totalReviewsObj = {}
  let finalResults = []

  try {
    let i = 0
    while (i < attractionIds.length) {
      variables.locationIds = attractionIds.slice(i, i + 5)
      let totalResponse = await axios.post(graphqlUrl, {
        query: query,
        variables: variables,
      })

      console.log({
        data: totalResponse.data.data,
      })
      totalResponse.data.data.locations.forEach((location) => {
        if (!location.reviewListPage) {
          console.log(location)
        }
        totalReviewsObj[location.locationId] =
          location.reviewListPage.totalCount
      })
      i += 5
    }
    await Promise.all(
      attractionIds.map(async (attractionId) => {
        variables.locationIds = [attractionId]
        variables.limit = MAX_PER_REQUEST

        let promises = []
        for (
          let index = 0;
          index < Math.ceil(totalReviewsObj[attractionId] / MAX_PER_REQUEST);
          index++
        ) {
          let newVariables = { ...variables }
          newVariables.offset = index * MAX_PER_REQUEST
          promises.push(
            axios.post(graphqlUrl, {
              query: query,
              variables: newVariables,
            })
          )
        }
        let responses = await Promise.all(promises)
        responses = responses
          .map((res) => res.data.data.locations[0])
          .reduce((prev, current) => {
            if (Array.isArray(prev)) {
              return current
            }
            prev.reviewListPage.reviews = prev.reviewListPage.reviews.concat(
              current.reviewListPage.reviews
            )
            return prev
          }, [])
        if (responses.locationId) finalResults.push(responses)
      })
    )
    fs.writeFile(
      `./data/attraction-reviews-${city}.json`,
      JSON.stringify(finalResults, null, 2),
      (err) => {
        console.log(err)
      }
    )
  } catch (err) {
    console.log(err)
  }
}

async function getData() {
  for (const city in request.cityIds) {
    await getCityDesc(city)
    const attractions = await getAttractions(city)
    const attractionIds = attractions.attractions.map(
      (item) => item.attractionId
    )
    await getReviews(attractionIds, city)
  }
}

getData()
