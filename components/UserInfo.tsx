import { Loader } from '@mantine/core'
import useQueryUser from '../hooks/useQueryUser'

const UserInfo = () => {
  const { data: user, status } = useQueryUser()
  if (status === 'loading') {
    return <Loader />
  }
  return <p>{user?.email}</p>
}

export default UserInfo
