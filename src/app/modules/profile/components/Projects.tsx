/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useRef, useState } from 'react'
import { KTSVG } from '../../../../_metronic/helpers'
import { Card2 } from '../../../../_metronic/partials/content/cards/Card2'
import { IconUserModel } from '../ProfileModels'
import { BarryAPI, Project } from '../../../Barry';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { useBarry } from '../../../BarryContext';
import { Employee, Epic, Manager, User } from '../../../models/_types';
import { BarryEventListner } from '../../../models/BarryEventListner';


export function Projects() {
  const history = useHistory();
  const { currentUser } = useBarry();
  const userListner = useRef<BarryEventListner | undefined>(undefined);
  const [projects, setProjects] = useState<Project[]>((currentUser as Employee).projects);
  const [epics, setEpics] = useState<Epic[]>((currentUser as Employee).epics);

  function onUserChange(event: string, target: User, options: any | undefined) {
    console.log('publisher::user:onUserChange(\'' + event + '\', target:', target, 'options:', options);
  }

  useEffect(() => {
    if (!userListner.current && currentUser)
      userListner.current = currentUser?.publisher.makeListner(listner => {
        listner.addHandler('change', onUserChange);
      });

    BarryAPI.projects.get({}, (newProjects: Array<Project>, error: Error | null) => {
      if (!newProjects || newProjects.length == 0 || error != null) {
        // Failed to fetch 
      } else {
        (currentUser as Employee).projects = newProjects;
        setProjects(newProjects);
      }
    })

    BarryAPI.epics.get({}, (newEpics: Array<Epic>, error: Error | null) => {
      if (!newEpics || newEpics.length == 0 || error != null) {
        // Failed to fetch 
      } else {
        (currentUser as Employee).epics = newEpics;
        setEpics(newEpics);
      }
    })

    return () => {
      userListner.current?.removeFromPublisherWithHandlers(currentUser?.publisher, undefined, userListner);
      console.log('publisher::user:', currentUser, 'listner:', userListner.current);
    }
  }, []);

  function didClickProject(project: Project) {
    userListner.current?.removeFromPublisherWithHandlers(currentUser?.publisher, undefined, userListner);
    history.push('/project-page/', {
      project: project,
      name: project.name,
    });
  }

  function didClickEpic(epic: Epic) {
    userListner.current?.removeFromPublisherWithHandlers(currentUser?.publisher, undefined, userListner);
    history.push('/project-page/', {
      project: epic.feature?.project,
      name: epic.feature?.project?.name,
    });
  }


  return (
    <>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder my-2'>
          {currentUser instanceof Manager ? 'My Projects' : 'My Assignments'}
        </h3>

        <div className='d-flex flex-wrap my-2'>

          {currentUser && (currentUser instanceof Manager) && <a
            href='#'
            className='btn btn-sm btn-primary'
            data-bs-toggle='modal'
            data-bs-target='#kt_modal_new_project'
            id='kt_toolbar_primary_button'
          >
            New Project
          </a>}
        </div>
      </div>

      <div className='row g-6 g-xl-9' style={{ marginBottom: '20px' }}>
        {
          ((currentUser instanceof Manager ? (currentUser as Manager)?.projects : epics) ?? []).map((pr: any, i: number) => {

            if (currentUser instanceof Manager) {
              return <div className='col-md-6 col-xl-4' key={i} onClick={() => { didClickProject(pr) }}>
                <Card2
                  icon='/media/svg/brand-logos/xing-icon.svg'
                  badgeColor='primary'
                  status='In Progress'
                  statusColor='primary'
                  title={pr.name ?? 'Unnamed Epic'}
                  description={pr.description ?? ''}
                  date={pr && pr.createDate ? new Date(pr.createDate).toLocaleString() : ''}
                  budget={pr && pr.createDate ? new Date(pr.createDate).toLocaleString() : ''}
                  progress={40}
                />
              </div>
            }
            else {
              const epic: Epic = pr as Epic;
              return <div className='col-md-6 col-xl-4' key={i} onClick={() => { didClickEpic(pr) }}>
                <Card2
                  icon='/media/svg/brand-logos/xing-icon.svg'
                  badgeColor='primary'
                  status='In Progress'
                  statusColor='primary'
                  title={pr.name ?? 'Unnamed Epic'}
                  description={pr.description ?? ''}
                  date={epic.assignment?.startDate ? new Date(epic.assignment?.startDate).toLocaleDateString() : ''}
                  budget={epic.assignment?.estimatedEndDate ? new Date(epic.assignment?.estimatedEndDate).toLocaleDateString() : ''}
                  progress={0}
                />
              </div>
            }

          })
        }
      </div>
    </>
  )
}

const users1: Array<IconUserModel> = [
  { name: 'Emma Smith', avatar: '/media/avatars/150-1.jpg' },
  { name: 'Rudy Stone', avatar: '/media/avatars/150-2.jpg' },
  { name: 'Susan Redwood', initials: 'S', color: 'primary' },
]

const users2 = [
  { name: 'Alan Warden', initials: 'A', color: 'warning' },
  { name: 'Brian Cox', avatar: '/media/avatars/150-4.jpg' },
]

const users3 = [
  { name: 'Mad Masy', avatar: '/media/avatars/150-1.jpg' },
  { name: 'Cris Willson', avatar: '/media/avatars/150-2.jpg' },
  { name: 'Mike Garcie', initials: 'M', color: 'info' },
]

const users4 = [
  { name: 'Nich Warden', initials: 'N', color: 'warning' },
  { name: 'Rob Otto', initials: 'R', color: 'success' },
]

const users5 = [
  { name: 'Francis Mitcham', avatar: '/media/avatars/150-5.jpg' },
  { name: 'Michelle Swanston', avatar: '/media/avatars/150-13.jpg' },
  { name: 'Susan Redwood', initials: 'S', color: 'primary' },
]

const users6 = [
  { name: 'Emma Smith', avatar: '/media/avatars/150-1.jpg' },
  { name: 'Rudy Stone', avatar: '/media/avatars/150-2.jpg' },
  { name: 'Susan Redwood', initials: 'S', color: 'primary' },
]

const users7 = [
  { name: 'Meloday Macy', avatar: '/media/avatars/150-3.jpg' },
  { name: 'Rabbin Watterman', initials: 'S', color: 'success' },
]

const users8 = [
  { name: 'Emma Smith', avatar: '/media/avatars/150-1.jpg' },
  { name: 'Rudy Stone', avatar: '/media/avatars/150-2.jpg' },
  { name: 'Susan Redwood', initials: 'S', color: 'primary' },
]

const users9 = [
  { name: 'Meloday Macy', avatar: '/media/avatars/150-3.jpg' },
  { name: 'Rabbin Watterman', initials: 'S', color: 'danger' },
]