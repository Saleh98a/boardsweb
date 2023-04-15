import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Charts } from './components/Charts'
import { Feeds } from './components/Feeds'
import { Lists } from './components/Lists'
import { Tables } from './components/Tables'
import { Mixed } from './components/Mixed'
import { Statistics } from './components/Statistics'

const widgetsBreadCrumbs: Array<PageLink> = [
  {
    title: 'Widgets',
    path: '/widgets/charts',
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

const WidgetsPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/widgets/charts'>
        <PageTitle breadcrumbs={widgetsBreadCrumbs}>Charts</PageTitle>
        <Charts />
      </Route>
      <Route path='/widgets/feeds'>
        <PageTitle breadcrumbs={widgetsBreadCrumbs}>Feeds</PageTitle>
        <Feeds />
      </Route>
      <Route path='/widgets/lists'>
        <PageTitle breadcrumbs={widgetsBreadCrumbs}>Lists</PageTitle>
        <Lists />
      </Route>
      <Route path='/widgets/mixed'>
        <PageTitle breadcrumbs={widgetsBreadCrumbs}>Mixed</PageTitle>
        <Mixed />
      </Route>
      <Route path='/widgets/tables'>
        <PageTitle breadcrumbs={widgetsBreadCrumbs}>Tables</PageTitle>
        <Tables />
      </Route>
      <Route path='/widgets/statistics'>
        <PageTitle breadcrumbs={widgetsBreadCrumbs}>Statiscics</PageTitle>
        <Statistics />
      </Route>
      <Redirect from='/widgets' exact={true} to='/widgets/lists' />
      <Redirect to='/widgets/lists' />
    </Switch>
  )
}

export default WidgetsPage
