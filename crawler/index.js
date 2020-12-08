const axios = require('axios')
const request = require('./request')
const graphqlUrl = 'https://www.tripadvisor.com.vn/data/graphql/batched'

const fs = require('fs')

function getAttractions(city = 'hanoi') {
  const query = request.attractions.query
  let variables = request.attractions.variables
  const cityIds = request.attractions.cityIds
  variables.geoId = cityIds[city]
  let total = 0
  axios
    .post(graphqlUrl, [
      {
        query: query,
        variables: variables,
      },
    ])
    .then((res) => {
      total = res.data[0].data.attractionsResponse[0].totalResults
      variables.limit = total
      axios
        .post(graphqlUrl, [
          {
            query: query,
            variables: variables,
          },
        ])
        .then((res) => {
          fs.writeFile(
            `./data/attractions-${city}.json`,
            JSON.stringify(res.data[0].data.attractionsResponse[0], null, 2),
            (err) => {
              console.log(err)
            }
          )
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err)
    })
}

// function getTags(locationIds) {
//   const query = request.tags.query
//   let variables = request.tags.variables
//   variables.locationIds = locationIds
// }
getAttractions()
