import { FC, useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap-v5";
import '../app.css'

export type CreateFeatureModalProps = {
    isVisible: boolean
    onVisibility?: ((visible: boolean)=>void)|undefined
    onSubmit?: ((feature: {name: string, description?: string|undefined})=>void)|undefined
}

const CreateFeatureModal: FC<CreateFeatureModalProps> = ({isVisible, onVisibility, onSubmit}) => {
    const formRef = useRef<HTMLElement>(null);
    const [show, setShow] = useState(isVisible);
    const [name, setName] = useState<string|undefined>(undefined);
    const [description, setDescription] = useState<string|undefined>(undefined);
  
    const handleClose = () => {setShow(false); onVisibility && onVisibility(false)};
    const handleSubmit = () => {
      if(!formRef.current){
        return;
      }
  
      if('reportValidity' in formRef.current){
        const isValid = (formRef.current as any).reportValidity() === true;
        if(isValid){
          onSubmit && onSubmit({name: name ?? 'Unnamed Feature', description: description});
          handleClose();
        } else {
          alert('Invalid parameters!');
        }
      } else {
        handleClose();
      }
    }
  
    useEffect(() => {
      if(isVisible !== show){
        setShow(isVisible);
      }
    }, [isVisible])
  
    return (
      <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create Feature</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Feature Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Feature title..."
                  autoFocus
                  required={true}
                  onChange={(e)=>{setName(e.target.value)}}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} onChange={(e)=>{setDescription(e.target.value)}}/>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Add Feature
            </Button>
          </Modal.Footer>
        </Modal>
    );
}


export { CreateFeatureModal }