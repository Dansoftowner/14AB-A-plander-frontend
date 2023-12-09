interface SetAction {
  type: 'SET_TOKEN'
  token: string
}
interface RemoveAction {
  type: 'REMOVE_TOKEN'
}
type Action = SetAction | RemoveAction
const authReducer = (token: string, action: Action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return action.token
    case 'REMOVE_TOKEN':
      return ''
    default:
      return token
  }
}
export default authReducer
