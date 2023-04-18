import axios from 'axios'
import { AuthModel, CredentialsModel } from '../models/AuthModel'
import { UserModel } from '../models/UserModel'

const API_URL = process.env.REACT_APP_API_URL || 'api'

console.log('API_URL::' + API_URL);
export const GET_USER_BY_CREDENTIALS_URL = `${API_URL}/login`
export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/auth`
export const LOGIN_URL = `${API_URL}/login`
export const EMPLOYEE_REGISTER_URL = `${API_URL}/employees`
export const MANAGER_REGISTER_URL = `${API_URL}/managers`
export const REQUEST_PASSWORD_URL = `${API_URL}/auth/forgot-password`

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post(LOGIN_URL, null, { params: { email, password } })
}

// Server should return AuthModel
export function register(email: string, firstName: string, lastName: string, password: string, accountType: string, days: number[]) {
  return axios.post<AuthModel>(accountType === 'Employee' ? EMPLOYEE_REGISTER_URL : MANAGER_REGISTER_URL, {
    email,
    firstName,
    lastName,
    password,
    workTable: days.map(day => {
      return { weekDay: day }
    })
  });
}

export function getUserByAuthCredentials(credentials: CredentialsModel) {
  // Authorization head should be fulfilled in interceptor.
  // Check common redux folder => setupAxios
  return axios.post<UserModel>(GET_USER_BY_CREDENTIALS_URL, null, {
    params: { email: credentials.email, password: credentials.password }
  }).then((response) => {
    const result = response && response.data && typeof response.data === 'object' ? response.data as any : undefined;

    if (result && (result.status === false || (result.errorCode && !isNaN(result.errorCode)))) {
      // Found an error.
      const err = new Error(result.errorMessage ?? "");
      (err as any).statusCode = result.errorCode;
      (err as any).status = result.status === true;
      throw err;
    } else if (result && result.data && typeof result.data === 'object') {
      // Handle response has data here.
      const dataType = (response.data as any).dataType;
      response.data = (response.data as any).data;
      if (!(response.data as any).dataType && typeof (response.data as any).dataType === 'undefined') {
        (response.data as any).dataType = dataType;
      }
    }

    return response;
  });
}
