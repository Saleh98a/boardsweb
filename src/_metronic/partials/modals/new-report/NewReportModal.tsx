import React, { FC, useEffect, useRef, useState } from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../helpers'
import * as Yup from 'yup'
import { StepperComponent } from '../../../assets/ts/components'
import { BarryApp, BarryAPI, Project } from '../../../../app/Barry';
import { useBarry } from '../../../../app/BarryContext'
import { Employee, Manager, Report } from '../../../../app/models/_types'
import { Button, Form, Modal } from 'react-bootstrap-v5'
import "react-datepicker/dist/react-datepicker.css"
import DatePicker from "react-datepicker";

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

export type NewReportModalProps = {
  isVisible: boolean
  onVisibility?: ((visible: boolean) => void) | undefined
  onSubmit?: ((report: Report) => void) | undefined
}

const NewReportModal: FC<NewReportModalProps> = ({ isVisible, onVisibility, onSubmit }) => {
  const { currentUser } = useBarry();
  const [show, setShow] = useState(isVisible);
  const [startDate, setStartDate] = useState(new Date());

  const handleClose = () => { setShow(false); onVisibility && onVisibility(false) };

  const handleSubmit = () => {

    const date = startDate;

    BarryAPI.reports.create(currentUser! as Employee, date, (report: Report | null, error: Error | null) => {
      if (!report || error != null) {
        // Failed to fetch 
      } else {
        // epicToBeAssigned!.assignment = assignment;
        onSubmit && onSubmit(report);
        console.log(report);
      }
    })

    handleClose();

  }

  useEffect(() => {
    if (isVisible !== show) {
      setShow(isVisible);
    }

    console.log('barry: ', BarryApp.currentUser());

  }, [isVisible])

  return (
    <Modal show={show} className='modal fade' dialogClassName='new-report-modal' id='kt_modal_new_report' aria-hidden='true'>
      <Modal.Header closeButton>
        <Modal.Title>Create Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <Form.Group>
            <DatePicker inline selected={startDate} onChange={(date) => setStartDate(date!)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Add Report
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export { NewReportModal }