// eslint-disable-next-line no-unused-vars
import { neo4jgraphql } from 'neo4j-graphql-js'
import fs from 'fs'
import path from 'path'

/*
 * Check for GRAPHQL_SCHEMA environment variable to specify schema file
 * fallback to schema.graphql if GRAPHQL_SCHEMA environment variable is not set
 */
console.log(process.env.GRAPHQL_SERVER_HOST)

export const typeDefs = fs
  .readFileSync(
    process.env.GRAPHQL_SCHEMA || path.join(__dirname, 'travel-schema.graphql')
  )
  .toString('utf-8')
