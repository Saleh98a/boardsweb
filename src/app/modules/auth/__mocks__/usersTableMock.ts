import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { UserModel } from '../models/UserModel'

export class UsersTableMock {
  public static table: Array<UserModel> = [
    {
      id: 1,
      username: 'admin',
      password: 'demo',
      email: 'admin@demo.com',
      auth: {
        accountId: "1",
        email: "employee1@barry.com",
        password: "Password1",
        // accessToken: 'access-token-8f3ae836da744329a6f93bf20594b5cc',
        // refreshToken: 'access-token-f8c137a2c98743f48b643e71161d90aa',
      },
      fullName: 'Sean S',
      firstName: 'Sean',
      lastName: 'Stark',
    },
    {
      id: 2,
      username: 'user',
      password: 'demo',
      email: 'user@demo.com',
      auth: {
        accountId: "2",
        email: "employee2@barry.com",
        password: "Password1",
        // accessToken: 'access-token-6829bba69dd3421d8762-991e9e806dbf',
        // refreshToken: 'access-token-f8e4c61a318e4d618b6c199ef96b9e55',
      },
      fullName: 'Megan F',
      firstName: 'Megan',
      lastName: 'Fox',
    },
    {
      id: 3,
      username: 'guest',
      password: 'demo',
      email: 'guest@demo.com',
      auth: {
        accountId: "3",
        email: "employee3@barry.com",
        password: "Password1",
        // accessToken: 'access-token-d2dff7b82f784de584b60964abbe45b9',
        // refreshToken: 'access-token-c999ccfe74aa40d0aa1a64c5e620c1a5',
      },
      fullName: 'Manu G',
      firstName: 'Manu',
      lastName: 'Ginobili',
    },
  ]
}
