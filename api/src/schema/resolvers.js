import { neo4jgraphql } from 'neo4j-graphql-js'
import { ApolloError } from 'apollo-server'
import crypto from 'crypto'
import { signToken } from '../utils'
export default {
  Query: {
    Attraction: async (obj, params, ctx, resolveInfo) => {
      let result = await neo4jgraphql(obj, params, ctx, resolveInfo)
      if (
        result.length &&
        Object.hasOwnProperty.call(result[0], 'ratingCount')
      ) {
        result.forEach((attraction) => {
          for (let index = 1; index <= 5; index++) {
            if (
              attraction.ratingCount.findIndex(
                (item) => item.rating === index
              ) === -1
            ) {
              attraction.ratingCount.push({ rating: index, count: 0 })
            }
          }
          attraction.ratingCount = attraction.ratingCount.sort(
            (a, b) => b.rating - a.rating
          )
          console.log(attraction.ratingCount)
        })
      }
      return result
    },
  },
  Mutation: {
    CreateUser: async (obj, params, ctx, resolveInfo) => {
      params.password = crypto
        .createHmac('sha256', process.env.PASSWORD_HASH_KEY)
        .update(params.password)
        .digest('hex')
      const findUser = await ctx.driver
        .session()
        .run(`MATCH (u:User {email: "${params.email}"}) return u`)
      if (findUser.records.length > 0) {
        throw new ApolloError('Tài khoản đã tồn tại', 200, [
          'This user already exists',
        ])
      }
      return neo4jgraphql(obj, params, ctx, resolveInfo, true)
    },
    LoginUser: async (obj, params, ctx) => {
      params.password = crypto
        .createHmac('sha256', process.env.PASSWORD_HASH_KEY)
        .update(params.password)
        .digest('hex')

      const session = ctx.driver.session()
      const cypher =
        'MATCH (u:User {email: $email, password: $password}) RETURN u'
      return session.run(cypher, params).then((result) => {
        if (result.records.length > 0) {
          const user = {
            id: result.records[0].get('u').properties.id,
            email: result.records[0].get('u').properties.email,
            username: result.records[0].get('u').properties.username,
            displayName: result.records[0].get('u').properties.displayName,
            roles: result.records[0].get('u').properties.roles,
          }
          const token = signToken(user)
          return { token }
        } else {
          throw new ApolloError('Tài khoản hoặc mật khẩu không đúng', 400, [
            'User or password is incorrect',
          ])
        }
      })
    },
  },
}
