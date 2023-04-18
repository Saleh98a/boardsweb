/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../_metronic/layout/core'
import { BarryAPI } from '../../Barry'
import { Assignment, Employee, Epic } from '../../models/_types'
import { Card2 } from '../../../_metronic/partials/content/cards/Card2'
import { Card6 } from '../../../_metronic/partials/content/cards/Card6'

const SchedulePage: FC = () => {

  const [schedule, setSchedule] = useState<Map<string, Assignment[]> | undefined>(undefined);
  const [employees, setEmployees] = useState<Map<string, Employee> | undefined>(undefined);

  useEffect(() => {
    BarryAPI.employees.get({}, (res, error) => {
      let employeesMap = new Map(res.map(e => ["" + e.accountId, e]));
      setEmployees(employeesMap);
    });
    BarryAPI.schedule.get((res, error) => {
      setSchedule(new Map(Object.entries(res!)));
    });
  }, [])

  function didClickAssignment(epic: Assignment) {
    // userListner.current?.removeFromPublisherWithHandlers(currentUser?.publisher, undefined, userListner);
    // history.push('/project-page/', {
    //   project: epic.feature?.project,
    //   name: epic.feature?.project?.name,
    // });
  }

  return (
    <div className='full-width-page d-flex flex-column flex-wrap container-fluid px-0 mx-0 h-100 overflow-scroll' style={{ marginBottom: '20px' }}>
      {
        (schedule && employees) && Array.from(schedule!.keys()).map((employeeAccountId: string, i: number) => {
          const employee = employees!.get(employeeAccountId);

          const employeePrefix = <div className='schedule-row-content me-8'><h3 style={{ width: '12rem' }}>{employee?.firstName} {employee?.lastName}</h3></div>

          const employeeRow = (schedule?.get(employeeAccountId))?.map((pr: Assignment, i: number) => {
            const startDate = new Date(pr.startDate);
            const endDate = new Date(pr.estimatedEndDate);
            const dateNow = new Date();
            return <div className='schedule-row-content me-4' key={i} onClick={() => didClickAssignment(pr)}>
              <Card6
                icon='/media/svg/brand-logos/xing-icon.svg'
                badgeColor='primary'
                status={startDate < dateNow && endDate > dateNow ? 'In Progress' : ''}
                statusColor='primary'
                title={pr.epic?.name ?? 'Unnamed Epic'}
                description={pr.epic?.description ?? ''}
                startDate={pr && pr.startDate ? startDate.toLocaleDateString() : ''}//'Start Date: Mar 14, 2021'
                endDate={pr && pr.estimatedEndDate ? endDate.toLocaleDateString() : ''}//'Start Date: Mar 14, 2021'
                budget='End Date: Mar 14, 2022'
                progress={40}
              />
            </div>
          })
          return <div className='schedule-row full-width-child d-flex flex-nowrap align-items-center mb-8 overflow-hidden'>{employeePrefix}{employeeRow}</div>
        })

      }
    </div >
  )
}

const ScheduleWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.SCHEDULE' })}</PageTitle>
      <SchedulePage />
    </>
  )
}

export { ScheduleWrapper }
