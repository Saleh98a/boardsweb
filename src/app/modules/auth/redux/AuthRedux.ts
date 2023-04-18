import { Action } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { put, takeLatest } from 'redux-saga/effects'
import { CredentialsModel } from '../models/AuthModel'
import { UserModel } from '../models/UserModel'
import { getUserByAuthCredentials } from './AuthCRUD'

export interface ActionWithPayload<T> extends Action {
  payload?: T
}

export const actionTypes = {
  Login: '[Login] Action',
  Logout: '[Logout] Action',
  Register: '[Register] Action',
  UserRequested: '[Request User] Action',
  UserLoaded: '[Load User] Auth API',
  SetUser: '[Set User] Action',
}

const initialAuthState: IAuthState = {
  user: undefined,
  accessToken: undefined,
  credentials: undefined
}

export interface IAuthState {
  user?: UserModel
  accessToken?: string
  credentials?: CredentialsModel
}

export const reducer = persistReducer(
  { storage, key: 'v100-demo1-auth', whitelist: ['user', 'accessToken', 'credentials'] },
  (state: IAuthState = initialAuthState, action: ActionWithPayload<IAuthState>) => {
    switch (action.type) {
      case actionTypes.Login: {
        const accessToken = action.payload?.accessToken
        const credentials = _getAuthCredentials(action);
        return { accessToken, user: undefined, credentials: credentials }
      }

      case actionTypes.Register: {
        const accessToken = action.payload?.accessToken
        return { accessToken, user: undefined }
      }

      case actionTypes.Logout: {
        return { accessToken: undefined, user: undefined, credentials: { email: '', password: '' } }
      }

      case actionTypes.UserRequested: {
        return { ...state, user: undefined }
      }

      case actionTypes.UserLoaded: {
        const user = action.payload?.user
        return { ...state, user }
      }

      case actionTypes.SetUser: {
        const user = action.payload?.user
        return { ...state, user }
      }

      default:
        return state
    }
  }
)

export const actions = {
  login: (accessToken: string, email: string, password: string) => ({ type: actionTypes.Login, payload: { accessToken, email, password } }),
  register: (accessToken: string) => ({
    type: actionTypes.Register,
    payload: { accessToken },
  }),
  logout: () => ({ type: actionTypes.Logout, payload: {} }),
  requestUser: (payload: any) => ({
    type: actionTypes.UserRequested,
    payload: payload
  }),
  fulfillUser: (user: UserModel) => ({ type: actionTypes.UserLoaded, payload: { user } }),
  setUser: (user: UserModel) => ({ type: actionTypes.SetUser, payload: { user } }),
}

export function* saga() {

  yield takeLatest(actionTypes.Login, function* loginSaga(action) {
    yield put(actions.requestUser((action as any).payload))
  })

  yield takeLatest(actionTypes.Register, function* registerSaga(action) {
    yield put(actions.requestUser((action as any).payload))
  })

  yield takeLatest(actionTypes.UserRequested, function* userRequested(payload) {
    const credentials = _getAuthCredentials(payload);
    if (credentials && credentials.email && credentials.password) {
      const { data: user } = yield getUserByAuthCredentials(credentials)
      yield put(actions.fulfillUser(user))
    } else {
      // TODO: shouldn't get here
    }
  })
}


function _getAuthCredentials(target: any): { email: string, password: string } | undefined {
  if (!target || target === undefined || target === null)
    return undefined;
  else if (target.email && target.password && (typeof target.email === 'string') && (typeof target.password === 'string'))
    return { email: target.email, password: target.password };
  else if (target.payload && target.payload !== null && target.payload !== undefined && typeof target.payload !== 'undefined')
    return _getAuthCredentials(target.payload);
  return undefined;
}