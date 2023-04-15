import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Overview } from './components/Overview'
import { Projects } from './components/Projects'
import { Campaigns } from './components/Campaigns'
import { Documents } from './components/Documents'
import { Connections } from './components/Connections'
import { ProfileHeader } from './ProfileHeader'

const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/pages/profile/overview',
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

const ProfilePage: React.FC = () => {
  return (
    <>
      <ProfileHeader />
      <Switch>
        <Route path='/pages/profile/overview'>
          <PageTitle breadcrumbs={profileBreadCrumbs}>Overview</PageTitle>
          <Overview />
        </Route>
        <Route path='/pages/profile/projects'>
          <PageTitle breadcrumbs={profileBreadCrumbs}>Projects</PageTitle>
          <Projects />
        </Route>
        <Route path='/pages/profile/campaigns'>
          <PageTitle breadcrumbs={profileBreadCrumbs}>Campaigns</PageTitle>
          <Campaigns />
        </Route>
        <Route path='/pages/profile/documents'>
          <PageTitle breadcrumbs={profileBreadCrumbs}>Documents</PageTitle>
          <Documents />
        </Route>
        <Route path='/pages/profile/connections'>
          <PageTitle breadcrumbs={profileBreadCrumbs}>Connections</PageTitle>
          <Connections />
        </Route>
        <Redirect from='/pages/profile' exact={true} to='/pages/profile/projects' />
        <Redirect to='/pages/profile/projects' />
      </Switch>
    </>
  )
}

export default ProfilePage
