// export interface _AuthModel {
//   accessToken: string
//   refreshToken?: string
// }

export interface CredentialsModel {
  email: string
  password: string
}

export interface AuthModel extends CredentialsModel {
  accountId: string
}