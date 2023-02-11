import React from "react";
                  
const ProjectPage: React.FC = () => {
    return <>
    <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder my-2'>
          My Projects 
          <span className='fs-6 text-gray-400 fw-bold ms-1'>Active</span>
        </h3>

        <div className='d-flex flex-wrap my-2'>
          <div className='me-4'>
            <select
              name='status'
              data-control='select2'
              data-hide-search='true'
              className='form-select form-select-sm form-select-white w-125px'
              defaultValue='Active'
            >
              <option value='Active'>Active</option>
              <option value='Approved'>In Progress</option>
              <option value='Declined'>To Do</option>
              <option value='In Progress'>Completed</option>
            </select>
          </div>

          <a
            href='#'
            className='btn btn-sm btn-primary'
            data-bs-toggle='modal'
            data-bs-target='#kt_modal_new_project'
            id='kt_toolbar_primary_button'
          >
            New Project
          </a>
        </div>
      </div>

      <h1>Hello From Project Page</h1>
    </>
}

export default ProjectPage;