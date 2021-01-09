import jwtDecode from 'jwt-decode'

import { useLazyQuery, gql } from '@apollo/client'
import { useEffect } from 'react'

export function useUser() {
  const token = localStorage.getItem('token')
  let user
  if (token) {
    user = jwtDecode(token)
  }
  return user
}

const GET_USER_INFO = gql`
  query getUserInfo($userId: ID!) {
    User(filter: { id: $userId }) {
      savedAttractions {
        id
      }
    }
  }
`

export function useUserInfo() {
  console.log('useUserInfo')
  const user = useUser()
  const [fetch, { data, refetch }] = useLazyQuery(GET_USER_INFO)
  useEffect(() => {
    if (user) {
      console.log('fetch')
      fetch({ variables: { userId: user.id } })
    }
  }, [user?.id])
  const userInfo = data ? data.User[0] : undefined
  const refetchUserInfo = () => {
    if (user) {
      refetch({ variables: { userId: user.id } })
    }
  }
  console.log({ userInfo })

  return [userInfo, refetchUserInfo]
}
