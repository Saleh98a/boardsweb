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
      <PageTitle breadcrumbs={profileBreadCrumbs}>Projects</PageTitle>
      <Projects />
    </>
  )
}

export default ProfilePage
