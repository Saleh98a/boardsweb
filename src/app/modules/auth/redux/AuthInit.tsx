import { FC, useRef, useEffect, useState } from 'react'
import { shallowEqual, useSelector, connect, useDispatch, ConnectedProps } from 'react-redux'
import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
import * as auth from './AuthRedux'
import { getUserByAuthCredentials } from './AuthCRUD'
import { RootState } from '../../../../setup'
import { CredentialsModel } from '../models/AuthModel'

const mapState = (state: RootState) => {
  return { auth: state.auth }
}
const connector = connect(mapState, auth.actions)
type PropsFromRedux = ConnectedProps<typeof connector>

const AuthInit: FC<PropsFromRedux> = (props) => {
  const didRequest = useRef(false)
  const dispatch = useDispatch()
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  const credentials = useSelector<RootState>(({ auth }) => auth.credentials, shallowEqual);
  const accessToken = useSelector<RootState>(({ auth }) => auth.accessToken, shallowEqual);

  //console.log('BARRY::PROVIDER::PROPS:props:', props.auth.credentials);
  // We should request user by authToken before rendering the application
  useEffect(() => {

    const requestUser = async () => {
      try {
        if (!didRequest.current) {
          if ((!accessToken || accessToken === undefined || accessToken === null || (typeof accessToken !== 'string')) && credentials && (credentials as CredentialsModel)) {
            const { data: user } = await getUserByAuthCredentials(credentials as CredentialsModel)
            dispatch(props.fulfillUser(user))
          } else {
            // TODO: shouldn't be reached
          }
        }
      } catch (error) {
        console.error(error)
        if (!didRequest.current) {
          dispatch(props.logout())
        }
      } finally {
        setShowSplashScreen(false)
      }

      return () => (didRequest.current = true)
    }

    if (accessToken || (credentials && !didRequest.current)) {
      requestUser()
    } else {
      dispatch(props.logout())
      setShowSplashScreen(false)
    }

    // eslint-disable-next-line
  }, [credentials])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{props.children}</>
}

export default connector(AuthInit)
