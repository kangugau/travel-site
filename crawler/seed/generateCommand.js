// const attractionsData = require('../data/attractions-hanoi.json')
// const attrations = attractionsData.attractions

function generateAttrationsCommands() {
  // return attrations
  //   .map((attraction) => {
  //     let mergeAttration = `MERGE (a: Attration {
  //   attrationId: "${attraction.attractionId}",
  //   name: "${attraction.location.name}",
  //   address: "${attraction.location.localizedStreetAddress.fullAddress}",
  //   location: {
  //     longitude: ${attraction.longitude},
  //     latitude: ${attraction.latitude}
  //   }
  // });`
  //     let mergeCategories = attraction.categoryIds
  //       .map((categoryId) => {
  //         return `MERGE (c: Category {
  //     categoryId: "${categoryId}"
  //   })`
  //       })
  //       .join('\n')
  //     return mergeAttration
  //   })
  //   .join('')
}

module.exports = {
  generateAttrationsCommands,
}
