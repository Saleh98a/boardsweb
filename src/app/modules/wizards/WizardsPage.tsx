import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Vertical } from './components/Vertical'
import { Horizontal } from './components/Horizontal'

const wizardsBreadCrumbs: Array<PageLink> = [
  {
    title: 'Wizards',
    path: '/pages/wizards/horizontal',
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

const WizardsPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/pages/wizards/horizontal'>
        <PageTitle breadcrumbs={wizardsBreadCrumbs}>Horizontal</PageTitle>
        <Horizontal />
      </Route>
      <Route path='/pages/wizards/vertical'>
        <PageTitle breadcrumbs={wizardsBreadCrumbs}>Vertical</PageTitle>
        <Vertical />
      </Route>
      <Redirect from='/pages/wizards' exact={true} to='/pages/wizards/horizontal' />
      <Redirect to='/pages/wizards/horizontal' />
    </Switch>
  )
}

export default WizardsPage
