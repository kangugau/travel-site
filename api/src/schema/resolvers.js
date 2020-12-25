import { neo4jgraphql } from 'neo4j-graphql-js'
import { ApolloError } from 'apollo-server'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
export default {
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
        throw new ApolloError('user_already_exists', 200, [
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
      return session
        .run(cypher, params)
        .then((result) => {
          if (result.records.length > 0) {
            const user = {
              id: result.records[0].get('u').properties.id,
              email: result.records[0].get('u').properties.email,
              username: result.records[0].get('u').properties.username,
              displayName: result.records[0].get('u').properties.displayName,
              role: result.records[0].get('u').properties.role,
            }
            const token = jwt.sign(user, process.env.JWT_SECRET, {
              expiresIn: process.env.TOKEN_EXPIRE_IN,
            })
            return { token: token }
          } else {
            throw new ApolloError('user_or_password_incorrect', 405, [
              'User or password is incorrect',
            ])
          }
        })
        .catch((e) => {
          throw new ApolloError('unkonw_error', 405, [`Error ${e.message}`])
        })
    },
  },
}
