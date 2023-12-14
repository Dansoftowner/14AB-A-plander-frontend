import { User } from '../hooks/useMember'

interface SetAction {
  type: 'SET_TOKEN'
  loggedUser: User
}
interface RemoveAction {
  type: 'REMOVE_TOKEN'
}
export type AuthAction = SetAction | RemoveAction

const authReducer = (user: User, action: AuthAction): User => {
  switch (action.type) {
    case 'SET_TOKEN':
      return action.loggedUser
    case 'REMOVE_TOKEN':
      return null as unknown as User
    default:
      return user
  }
}
export default authReducer
