import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {Redirect, Switch} from 'react-router-dom'
import * as auth from './redux/AuthRedux'

export function Logout() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(auth.actions.logout())
    // setTimeout(()=> {
    //   document.location.reload()
    // }, 200)

    return () => {
      setTimeout(()=>{
        document.location.reload();
      }, 100)
    }
  }, [dispatch])

  return (
    <Switch>
      <Redirect to='/auth/login' />
    </Switch>
  )
}
