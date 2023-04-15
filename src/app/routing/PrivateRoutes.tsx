import React, { Suspense, lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { FallbackView } from '../../_metronic/partials'
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { MenuTestPage } from '../pages/MenuTestPage'
import { ScheduleWrapper } from '../pages/schedule/ScheduleWrapper'

export function PrivateRoutes() {
  const BuilderPageWrapper = lazy(() => import('../pages/layout-builder/BuilderPageWrapper'))
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/profile/AbsencesPage'))
  const ProjectPage = lazy(() => import('../pages/ProjectPage'))

  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path='/dashboard' component={ProfilePage} />
        <Route path='/schedule' component={ScheduleWrapper} />
        <Route path='/builder' component={BuilderPageWrapper} />
        <Route path='/pages/profile' component={ProfilePage} />
        <Route path='/pages/absences' component={ChatPage} />
        <Route path='/pages/wizards' component={WizardsPage} />
        <Route path='/widgets' component={WidgetsPage} />
        <Route path='/account' component={AccountPage} />
        <Route path='/apps/chat' component={ChatPage} />
        <Route path='/menu-test' component={MenuTestPage} />
        <Route path="/project-page" component={ProjectPage} />
        <Redirect from='/auth' to='/dashboard' />
        <Redirect exact from='/' to='/dashboard' />
        <Redirect to='error/404' />
      </Switch>
    </Suspense>
  )

}
