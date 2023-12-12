interface SetAction {
  type: 'SET_TOKEN'
  userId: string
}
interface RemoveAction {
  type: 'REMOVE_TOKEN'
}
export type AuthAction = SetAction | RemoveAction
const authReducer = (userId: string, action: AuthAction) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return action.userId
    case 'REMOVE_TOKEN':
      return ''
    default:
      return userId
  }
}
export default authReducer
