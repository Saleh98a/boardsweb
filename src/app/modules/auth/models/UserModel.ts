import { AuthModel } from './AuthModel'

export interface UserModel {
  id: number
  username: string
  password: string | undefined
  email: string
  firstName: string
  lastName: string
  fullName?: string
  auth?: AuthModel
}
