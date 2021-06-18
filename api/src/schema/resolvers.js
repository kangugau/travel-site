import { neo4jgraphql } from 'neo4j-graphql-js'
import { ApolloError } from 'apollo-server'
import crypto from 'crypto'
import { signToken } from '../utils'
import neo4j from 'neo4j-driver'

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
    AttractionsNearBy: async (obj, params, ctx) => {
      console.log({ params })
      let result = await ctx.driver.session().run(`MATCH (a:Attraction{id: "${
        params.attractionId
      }"})-->(:City)<--(a2)
      WITH a2, distance(a.location, a2.location)/1000 as distance
      WITH a2, distance ORDER BY distance LIMIT toInteger(${params.first || 6})
      match (a2)-->(t:Type) 
      with a2, distance, collect(t) as types 
      optional match (a2)<--(r:Review)
      with a2, distance, types, count(r) as total, coalesce(avg(r.rating), toFloat(0)) as avg
      call {
        with a2
        optional match (a2)-->(thumb:Photo) return thumb limit 1
      }
      return a2, distance, types, total, avg, thumb`)

      result = result.records.map((record) => {
        console.log(record)
        return {
          attraction: {
            ...record.get(0).properties,
            types: record.get(2).map((type) => type.properties),
            totalRating: neo4j.int(record.get(3)).toNumber(),
            avgRating: record.get(4),
            thumbnail: record.get(5).properties,
          },
          distance: record.get(1),
        }
      })
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
      params.roles = ['USER']
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
    CreateReview: async (obj, params, ctx, resolveInfo) => {
      if (!ctx.user)
        throw new ApolloError('Yêu cầu đăng nhập', 405, ['Login required'])
      return neo4jgraphql(obj, params, ctx, resolveInfo)
    },
  },
}
