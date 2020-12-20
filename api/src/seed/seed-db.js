import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { getSeedMutations } from './seed-mutations'

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

const runMutations = async (runAttraction, runFilter, runReview, runPhoto) => {
  const {
    attractionMutations,
    categoryMutations,
    typeMutations,
    tagMutations,
    filterMutations,
    reviewMutations,
    thumbnailMutations,
    reviewPhotoMutations,
  } = getSeedMutations()
  let count = 0
  if (runAttraction) {
    try {
      await Promise.all(
        attractionMutations.map(({ mutation, variables }) => {
          return client
            .mutate({
              mutation,
              variables,
            })
            .catch((e) => {
              console.log(JSON.stringify(e, null, 2))
              throw new Error(e)
            })
        })
      )
      await Promise.all(
        categoryMutations.map(({ mutation, variables }) => {
          count++
          return client.mutate({
            mutation,
            variables,
          })
        })
      )
      await Promise.all(
        typeMutations.map(({ mutation, variables }) => {
          count++
          return client.mutate({
            mutation,
            variables,
          })
        })
      )

      await Promise.all(
        tagMutations.map(({ mutation, variables }) => {
          count++
          return client.mutate({
            mutation,
            variables,
          })
        })
      )
      console.log(count)
    } catch (error) {
      console.log(error)
    }
  }
  if (runFilter) {
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
            return client
              .mutate({ mutation, variables })
              .catch((error) => console.log({ error }))
          })
        )
      }
    } catch (error) {
      console.log(error.networkError.result.errors)
    }
  }
  if (runPhoto) {
    console.log(
      'adding photos',
      reviewPhotoMutations.length + thumbnailMutations.length
    )
    try {
      await Promise.all(
        thumbnailMutations.map(({ mutation, variables }) => {
          return client
            .mutate({ mutation, variables })
            .catch((error) =>
              console.log({ error: error.networkError.result.errors })
            )
        })
      )
    } catch (error) {
      console.log(error)
    }

    try {
      await Promise.all(
        reviewPhotoMutations.map(({ mutation, variables }) => {
          return client
            .mutate({ mutation, variables })
            .catch((error) => console.log({ error }))
        })
      )
    } catch (error) {
      console.log(error)
    }
  }
}

runMutations(true, false, false, false).then(() => {
  console.log('Database seeded!')
})
// .catch((e) => console.error(e))
