import React, { FC, useEffect, useRef, useState } from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../helpers'
import { Formik, Form, FormikValues, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { StepperComponent } from '../../../assets/ts/components'
import { BarryApp, BarryAPI, Project } from '../../../../app/Barry';
import { useBarry } from '../../../../app/BarryContext'
import { Manager } from '../../../../app/models/_types'

interface ICreateAccount {
  appName: string
  startDate: Date
}

const inits: ICreateAccount = {
  appName: '',
  startDate: new Date(2023, 0, 12),
}

const createAppSchema = [
  Yup.object({
    appName: Yup.string().required().label('App name'),
    startDate: Yup.date().required().label('Start Date'),
  })
]


const NewProjectModal: FC = () => {
  const { currentUser } = useBarry();
  const stepperRef = useRef<HTMLDivElement | null>(null)
  const stepper = useRef<StepperComponent | null>(null)
  const [currentSchema, setCurrentSchema] = useState(createAppSchema[0])
  const [initValues] = useState<ICreateAccount>(inits)

  const loadStepper = () => {
    stepper.current = StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
    console.log('steeper:', stepper.current);
  }

  const prevStep = () => {
    if (!stepper.current) {
      return
    }

    stepper.current.goPrev()

    setCurrentSchema(createAppSchema[stepper.current.currentStepIndex - 1])
  }

  const submitStep = (values: ICreateAccount, actions: FormikValues) => {
    console.log('submit, current:', stepper.current);
    if (!stepper.current) {
      return
    }

    setCurrentSchema(createAppSchema[stepper.current.currentStepIndex])

    if (stepper.current.currentStepIndex !== stepper.current.totatStepsNumber) {
      stepper.current.goNext()
    } else {
      stepper.current.goto(1)
      actions.resetForm()
    }

    if (!currentUser || !(currentUser instanceof Manager)) {
      return;
    }

    currentUser.create({
      name: values.appName,
      startDate: values.startDate
    }).then((response) => {
      console.log('project::success:', response);
    }).catch((error) => {
      console.log('project::fail:', error);
    })
    return;

    console.log('submit with values:', values);
    // 0, 4, 5, values.appName, values.startDate
    BarryAPI.projects.create(new Project({
      id: 0,
      managerId: 2,
      name: values.appName,
      createDate: values.startDate
    }), function (project: Project | null, error: Error | null) {
      console.log('project:', project, 'error:', error);
    });
  }

  useEffect(() => {
    if (!stepperRef.current) {
      return
    }

    console.log('barry: ', BarryApp.currentUser());

    loadStepper()
  }, [stepperRef])

  return (
    <div className='modal fade' id='kt_modal_new_project' aria-hidden='true'>
      <div className='modal-dialog modal-dialog-centered mw-900px'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h2>New Project</h2>

            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
              <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
            </div>
          </div>

          <div className='modal-body py-lg-10 px-lg-10'>
            <div
              ref={stepperRef}
              className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid'
              id='kt_modal_create_app_stepper'
            >

              <div className='d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px' style={{ display: 'none' }}>
                <div className='stepper-nav ps-lg-10'>
                  <div className='stepper-item current' data-kt-stepper-element='nav'>
                    <div className='stepper-line w-40px'></div>

                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>1</span>
                    </div>

                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Project Details</h3>

                      <div className='stepper-desc'>Name your Project</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex-row-fluid py-lg-5 px-lg-15'>
                <Formik
                  validationSchema={currentSchema}
                  initialValues={initValues}
                  onSubmit={submitStep}
                >
                  {() => (
                    <Form className='form' noValidate id='kt_modal_create_app_form'>
                      <div className='current' data-kt-stepper-element='content'>
                        <div className='w-100'>
                          <div className='fv-row mb-10'>
                            <label className='d-flex align-items-center fs-5 fw-bold mb-2'>
                              <span className='required'>Project Name</span>
                              <i
                                className='fas fa-exclamation-circle ms-2 fs-7'
                                data-bs-toggle='tooltip'
                                title='Specify your unique app name'
                              ></i>
                            </label>
                            <Field
                              type='text'
                              className='form-control form-control-lg form-control-solid my-2'
                              name='appName'
                              placeholder=''
                            />
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='appName' />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='d-flex flex-stack pt-10'>
                        <div className='me-2'>
                          <button
                            onClick={prevStep}
                            type='button'
                            className='btn btn-lg btn-light-primary me-3'
                            data-kt-stepper-action='previous'
                          >
                            <KTSVG
                              path='/media/icons/duotune/arrows/arr063.svg'
                              className='svg-icon-4 me-1'
                            />
                            Back
                          </button>
                        </div>

                        <div>
                          <button type='submit' className='btn btn-lg btn-primary me-3'>
                            <span className='indicator-label'>
                              {stepper.current?.passedStepIndex !==
                                stepper.current?.totatStepsNumber! - 1 && 'Continue'}
                              {stepper.current?.passedStepIndex ===
                                stepper.current?.totatStepsNumber! - 1 && 'Submit'}
                              <KTSVG
                                path='/media/icons/duotune/arrows/arr064.svg'
                                className='svg-icon-3 ms-2 me-0'
                              />
                            </span>
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { NewProjectModal }