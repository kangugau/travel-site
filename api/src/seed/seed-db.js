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

const runMutations = async () => {
  const mutations = getSeedMutations()
  let count = 0
  await Promise.all(
    mutations.map(({ mutation, variables }) => {
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
    mutations.map(async ({ categoryMutations }) => {
      return Promise.all(
        categoryMutations.map(({ mutation, variables }) => {
          count++
          return client.mutate({
            mutation,
            variables,
          })
        })
      )
    })
  )
  await Promise.all(
    mutations.map(async ({ typeMutations }) => {
      return Promise.all(
        typeMutations.map(({ mutation, variables }) => {
          count++
          return client.mutate({
            mutation,
            variables,
          })
        })
      )
    })
  )

  // await each group of mutation due to large amount of concurrent connections
  for (let i = 0; i < mutations.length; i++) {
    const { tagMutations } = mutations[i]
    await Promise.all(
      tagMutations.map(({ mutation, variables }) => {
        count++
        return client.mutate({
          mutation,
          variables,
        })
      })
    )
  }

  console.log(count)
}

runMutations()
  .then(() => {
    console.log('Database seeded!')
  })
  .catch((e) => console.error(e))
