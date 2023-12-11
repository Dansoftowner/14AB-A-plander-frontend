interface SetAction {
  type: 'SET_TOKEN'
  isLoggedIn: boolean
}
interface RemoveAction {
  type: 'REMOVE_TOKEN'
}
export type AuthAction = SetAction | RemoveAction
const authReducer = (isLoggedIn: boolean, action: AuthAction) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return action.isLoggedIn
    case 'REMOVE_TOKEN':
      return false
    default:
      return isLoggedIn
  }
}
export default authReducer
