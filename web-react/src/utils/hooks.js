import { useLazyQuery, gql } from '@apollo/client'
import { useEffect, useContext } from 'react'

import { AuthContext } from '../contexts/AuthContext'

export function useUser() {
  return useContext(AuthContext).user
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
