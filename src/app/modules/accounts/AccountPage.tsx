import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Overview } from './components/Overview'
import { Settings } from './components/settings/Settings'
import { AccountHeader } from './AccountHeader'

const accountBreadCrumbs: Array<PageLink> = [
  {
    title: 'Account',
    path: '/account/overview',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const AccountPage: React.FC = () => {
  return (
    <>
      <AccountHeader />
      <Switch>
        <Route path='/account/overview'>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Overview</PageTitle>
          <Overview />
        </Route>
        <Route path='/account/settings'>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Settings</PageTitle>
          <Settings />
        </Route>

        <Redirect from='/account' exact={true} to='/account/overview' />
        <Redirect to='/account/overview' />
      </Switch>
    </>
  )
}

export default AccountPage
