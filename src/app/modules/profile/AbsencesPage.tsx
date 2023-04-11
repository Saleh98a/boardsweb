import '../../app.css'

import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Overview } from './components/Overview'
import { Projects } from './components/Projects'
import { Campaigns } from './components/Campaigns'
import { Documents } from './components/Documents'
import { Connections } from './components/Connections'
import { ProfileHeader } from './ProfileHeader'
import { ListGroup } from 'react-bootstrap-v5'
import { NewReportModal } from '../../../_metronic/partials/modals/new-report/NewReportModal'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BarryAPI } from '../../Barry'
import { useBarry } from '../../BarryContext'
import { Employee, Report } from '../../models/_types'


const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/crafted/pages/profile/overview',
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

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const AbsencesPage: React.FC = () => {
  const { currentUser } = useBarry();
  const [isNewReportModalVisible, setNewReportModalVisible] = useState<boolean>(false);
  const [reportsList, setReportsList] = useState<Report[] | undefined>(undefined);

  useEffect(() => {
    BarryAPI.reports.get(currentUser as Employee, (reports, error) => {
      setReportsList(reports!);
    });
  }, [isNewReportModalVisible]);

  function onNewReportClick() {
    setNewReportModalVisible(true);
  }

  return (
    <>

      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder my-2'>
          Absences Reports
        </h3>

        <div className='d-flex flex-wrap my-2'>

          <a
            href='#'
            className='btn btn-sm btn-primary'
            data-bs-toggle='modal'
            data-bs-target='#kt_modal_new_report'
            id='kt_toolbar_primary_button'
            onClick={onNewReportClick}
          >
            New Report
          </a>
        </div>
      </div>
      <br />
      <ListGroup as="ol" className="my-2">
        {reportsList?.map((report) => {
          return (
            <ListGroup className="absence-row" as="ol" horizontal>
              <ListGroup.Item as="li" className="w-100">{weekday[(new Date(report.date)).getDay()]}</ListGroup.Item>
              <ListGroup.Item as="li" className="w-100">{(new Date(report.date)).toLocaleDateString()}</ListGroup.Item>
              <ListGroup.Item as="li" className="w-100">{report.type}</ListGroup.Item>
              <ListGroup.Item className="w-25 delete-report-action" action as="li"><FontAwesomeIcon icon={faTrashCan} /></ListGroup.Item>
            </ListGroup>
          )
        })}
      </ListGroup>

      <NewReportModal isVisible={isNewReportModalVisible} onVisibility={(visible) => setNewReportModalVisible(visible)} onSubmit={undefined} />

    </>
  )
}

export default AbsencesPage
