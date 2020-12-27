import jwtDecode from 'jwt-decode'

export function useUser() {
  const token = localStorage.getItem('token')
  let user
  if (token) {
    user = jwtDecode(token)
  }
  return user
}
