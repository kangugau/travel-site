import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { getSeedMutations } from './seed-mutations'
const CONCURRENT_REQUEST_LIMIT = 200
dotenv.config()

const {
  GRAPHQL_SERVER_HOST: host,
  GRAPHQL_SERVER_PORT: port,
  GRAPHQL_SERVER_PATH: path,
} = process.env

const uri = `http://${host}:${port}${path}`

const client = new ApolloClient({
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache(),
})

const runMutations = async (
  runAttraction = true,
  runFilter = true,
  runReview = true,
  runPhoto = true
) => {
  const mutations = getSeedMutations()
  for (let index = 0; index < mutations.length; index++) {
    const {
      cityMutation,
      attractionMutations,
      categoryMutations,
      typeMutations,
      tagMutations,
      filterMutations,
      reviewMutations,
      thumbnailMutations,
      reviewPhotoMutations,
    } = mutations[index]
    await client
      .mutate({
        mutation: cityMutation.mutation,
        variables: cityMutation.variables,
      })
      .catch((e) => {
        console.log(JSON.stringify(e, null, 2))
        throw new Error(e)
      })
    if (runAttraction) {
      try {
        console.log('======Attraction======')
        await Promise.all(
          attractionMutations.map(({ mutation, variables }) => {
            return client.mutate({
              mutation,
              variables,
            })
          })
        )

        console.log('======Category======')
        await Promise.all(
          categoryMutations.map(({ mutation, variables }) => {
            return client.mutate({
              mutation,
              variables,
            })
          })
        )

        console.log('======Type======')
        await Promise.all(
          typeMutations.map(({ mutation, variables }) => {
            return client.mutate({
              mutation,
              variables,
            })
          })
        )

        console.log('======Tag======')
        await Promise.all(
          tagMutations.map(({ mutation, variables }) => {
            return client.mutate({
              mutation,
              variables,
            })
          })
        )
      } catch (error) {
        console.log(JSON.stringify(error, null, 2))
      }
    }
    if (runFilter) {
      console.log('======Filter======')

      await Promise.all([
        ...filterMutations.categoryMutations.map(({ mutation, variables }) => {
          return client.mutate({ mutation, variables })
        }),
        ...filterMutations.typeMutations.map(({ mutation, variables }) => {
          return client.mutate({ mutation, variables })
        }),
        ...filterMutations.tagMutations.map(({ mutation, variables }) => {
          return client.mutate({ mutation, variables })
        }),
      ])
    }
    if (runReview) {
      try {
        for (const batch of reviewMutations) {
          await Promise.all(
            batch.map(({ mutation, variables }) => {
              return client.mutate({ mutation, variables })
            })
          )
        }
      } catch (error) {
        console.log(JSON.stringify(error, null, 2))
      }
    }
    if (runPhoto) {
      console.log('======Thumbnail======', thumbnailMutations.length)
      try {
        await Promise.all(
          thumbnailMutations.map(({ mutation, variables }) => {
            return client.mutate({ mutation, variables })
          })
        )
      } catch (error) {
        console.log(JSON.stringify(error, null, 2))
      }

      console.log('======Review Photo======', reviewPhotoMutations.length)
      try {
        for (
          let start = 0;
          start < reviewPhotoMutations.length;
          start += CONCURRENT_REQUEST_LIMIT
        ) {
          const end =
            start + CONCURRENT_REQUEST_LIMIT > reviewPhotoMutations.length
              ? reviewPhotoMutations
              : start + CONCURRENT_REQUEST_LIMIT
          await Promise.all(
            reviewPhotoMutations
              .slice(start, end)
              .map(({ mutation, variables }) => {
                return client.mutate({ mutation, variables })
              })
          )
        }
      } catch (error) {
        console.log(JSON.stringify(error, null, 2))
      }
    }
  }
}

runMutations().then(() => {
  console.log('Database seeded!')
})
// .catch((e) => console.error(e))
