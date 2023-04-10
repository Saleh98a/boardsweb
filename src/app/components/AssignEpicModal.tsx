import { FC, useEffect, useRef, useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap-v5";
import '../app.css'
import { Dropdown1 } from "../../_metronic/partials";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { BarryAPI } from "../Barry";
import { Assignment, Employee, Epic } from "../models/_types";

export type AssignEpicProps = {
  selectedEmployee: Employee | undefined,
  epic: Epic | undefined,
  assignment: Assignment | undefined,
}
export type AssignEpicModalProps = {
  isVisible: boolean
  epicToBeAssigned: Epic | undefined
  onVisibility?: ((visible: boolean) => void) | undefined
  onSubmit?: ((epic: AssignEpicProps) => void) | undefined
}

const AssignEpicModal: FC<AssignEpicModalProps> = ({ isVisible, epicToBeAssigned, onVisibility, onSubmit }) => {
  const formRef = useRef<HTMLElement>(null);
  const [show, setShow] = useState(isVisible);
  const [name, setName] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [duration, setDuration] = useState<number>(0);
  const [employees, setEmployees] = useState<Employee[] | undefined>(undefined);
  const [selectedEmployee, setSelectedEmployees] = useState<Employee | undefined>(undefined);

  const handleClose = () => { setShow(false); onVisibility && onVisibility(false) };
  const handleSubmit = () => {
    BarryAPI.epics.assign(epicToBeAssigned!, selectedEmployee!, (assignment: Assignment | null, error: Error | null) => {
      if (!assignment || error != null) {
        // Failed to fetch 
      } else {
        epicToBeAssigned!.assignment = assignment;
        onSubmit && onSubmit({
          epic: epicToBeAssigned,
          selectedEmployee: selectedEmployee,
          assignment: assignment,
        });
        console.log(assignment);
      }
    })

    handleClose();

  }

  useEffect(() => {
    if (isVisible !== show) {
      setShow(isVisible);
    }

    BarryAPI.employees.get({}, (employees: Array<Employee>, error: Error | null) => {
      if (!employees || employees.length == 0 || error != null) {
        // Failed to fetch 
      } else {
        setEmployees(employees);
      }
    })
  }, [isVisible])

  function onEmployeeSelected(employee: Employee): void {
    setSelectedEmployees(employee);
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Assign Epic</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Dropdown>
          Choose employee:
          <Dropdown.Toggle className="py-0 p-2" variant="none" size="sm" id="dropdown-basic">
            {selectedEmployee?.firstName} {selectedEmployee?.lastName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {employees?.map(e => (<Dropdown.Item onClick={() => onEmployeeSelected(e)}>{e?.firstName} {e?.lastName}</Dropdown.Item>))}
          </Dropdown.Menu>
        </Dropdown>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Assign Epic
        </Button>
      </Modal.Footer>
    </Modal>
  );
}


export { AssignEpicModal }