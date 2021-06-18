import jwt from 'jsonwebtoken'

export function signToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE_IN,
  })
}

export function verifyToken(token) {
  let decoded = false
  if (token) {
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      console.log(error)
    }
  }
  return decoded
}
