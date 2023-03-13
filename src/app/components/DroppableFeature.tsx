import React, { FC, useEffect, useRef, useState } from "react";
import '../app.css'

import styled from '@emotion/styled'
import { Droppable, Draggable, DropResult, OnDragEndResponder } from 'react-beautiful-dnd';
import { Epic, Feature, Manager } from "../models/_types";
import { Button, Dropdown } from "react-bootstrap-v5";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { BarryEventListner } from "../models/BarryEventListner";
import { useBarry } from "../BarryContext";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { CreateEpicModal, EpicSubmitProps } from "./CreateEpicModal";

import Moment from 'react-moment';
import 'moment-timezone';

const grid = 8;

const QuoteItem = styled.div``;


type DraggableEpicContentProps = React.PropsWithChildren<{
    epic: Epic
    index: number
    deleteHandler?: ((epic: Epic, index: number)=>void)|undefined
}>;

const DraggableEpicContent: FC<DraggableEpicContentProps> = ({epic, index, deleteHandler}) => {

    function onDeleteClickHandler(){
        deleteHandler && deleteHandler(epic, index);
    }

    return (
        <div className="draggable-epic-content container-fluid p-0">
            <div className="row justify-content-between g-0">
                <div className="col-auto p-0 d-flex align-items-center">
                    <span className="fw-bolder">{epic.name}</span>
                </div>
                <div className="col-auto p-0">
                <Dropdown>
                    <Dropdown.Toggle className="options-button py-0 p-2" variant="none" size="sm" id="dropdown-basic">
                        <FontAwesomeIcon icon={faEllipsisVertical}/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={onDeleteClickHandler}><FontAwesomeIcon icon={faTrashCan}/> &nbsp; Delete</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            {
                epic.description && epic.description.trim().length > 0 && <div className="row text-muted g-0">{epic.description}</div>
            }
            <div className="row g-0 mt-2">
                <table>
                    <thead/>
                    <tbody>
                        {
                        epic.startDate ? <tr>
                            <td>Starting At:</td>
                            <td><Moment className="fw-bolder" format="YYYY/MM/DD HH:mm" local={true} date={epic.startDate} style={{width: 'fit-content'}} /></td>
                        </tr> : <tr>
                            <td className="text-muted" style={{textDecoration: 'line-through'}}>No start date assigned</td>
                        </tr>
                        }
                        {
                        epic.duration > 0 ? <tr>
                            <td>Duration:</td>
                            <td className="fw-bolder">{epic.duration}.h</td>
                        </tr> : <tr>
                            <td className="text-muted" style={{textDecoration: 'line-through'}}>No duration assigned</td>
                        </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}


type DraggableEpicProps = DraggableEpicContentProps & {
}

function DraggableEpic({ epic, index, deleteHandler }: DraggableEpicProps) {
    return (
        <Draggable draggableId={`${epic.id}`} index={index}>
        {provided => (
            <QuoteItem
            className="draggable-epic-container p-4"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            >
                <DraggableEpicContent epic={epic} index={index} deleteHandler={deleteHandler} />
            </QuoteItem>
        )}
        </Draggable>
    );
}

type DraggableEpicListProps = {
    epics: Epic[]
    rerenderer?: number|undefined
    deleteHandler?: ((epic: Epic, index: number)=>void)|undefined
}

const DraggableEpicList: FC<DraggableEpicListProps> = ({epics, rerenderer, deleteHandler}) => {
    const [epicsRender, setEpicsRender] = useState<number|undefined>(rerenderer);
    const [epicsState, setEpicsState] = useState<Epic[]>(epics);

    useEffect(()=> {
        console.log('epic::list::epics:', epics, 'state:', epics);
        if(epics !== epicsState){
            setEpicsState(epics);
            if(rerenderer !== epicsRender)
                setEpicsRender(rerenderer);
        } else if(rerenderer !== epicsRender)
            setEpicsRender(rerenderer);

    }, [epics, rerenderer])

    return (
    <>{epicsState.map((epic: Epic, index: number) => (
        <DraggableEpic epic={epic} index={index} key={epic.id} deleteHandler={deleteHandler} />
    ))}</>);
};


type DroppableFeatureProps = {
    feature: Feature,
    index: number,
    deleteFeature?: ((feature: Feature, index: number)=>void)|undefined
    createEpicHandler?: ((feature: Feature, index: number)=>void)|undefined
}

const DroppableFeature: FC<DroppableFeatureProps> = ({feature, index, deleteFeature, createEpicHandler}) => {
    const { currentUser } = useBarry();
    const featureListner = useRef<BarryEventListner|undefined>(undefined);
    const [epics, setEpics] = useState<Epic[]>(feature.epics);
    const [epicsRender, setEpicsRender] = useState<number>(0);
    const [isCreateEpicVisible, setCreateEpicVisible] = useState<boolean>(false);

    useEffect(() => {
        registerToFeature(feature);

        console.log('ProjectBoard::useEffect:feature::', feature, 'epics:', epics);
        if(epics !== feature.epics){
            setEpics(feature?.epics ?? []);
        }

        return () => {
            featureListner.current?.removeFromPublisherWithHandlers(feature?.publisher, undefined, featureListner);
            console.log('publisher::feature:unmount', feature, 'listner:', featureListner.current);
        }
    })


    function onFeatureChange(event: string, target: Feature, options: any|undefined){
        if(target === feature && options && options.name === 'epics'){
            console.log('publisher::project:onFeatureChange(\'' + event + '\', target:', target, 'options:', options);
            setEpics(target.epics);
            setEpicsRender(Math.random()*100000);
        }
    }

    function onDeleteEpic(epic: Epic, i: number){
        if(!epic || !feature)
            return;

        feature.delete(epic);
    }

    function deleteFeatureClick(){
        deleteFeature && deleteFeature(feature, index);
    }

    function onCreateEpicClick(){
        createEpicHandler && createEpicHandler(feature, index);
        setCreateEpicVisible(true);
    }

    function createEpicSubmit(epic: EpicSubmitProps){
        if(!epic || epic === undefined || epic === null || !feature || feature === undefined || feature === null)
            return;

        if(currentUser && (currentUser instanceof Manager))
            feature.create(epic, currentUser);
    }


    function registerToFeature(newFeature: Feature|undefined, oldFeature?: Feature|undefined): BarryEventListner|undefined {
        if(!newFeature || !(newFeature instanceof Feature)){
            if(featureListner.current){
                featureListner.current?.removeAllHandlers();
                oldFeature && featureListner.current?.removeFromPublisher(oldFeature.publisher);
                featureListner.current = undefined;
            }
          return undefined;
        } else if(!featureListner.current && newFeature)
            featureListner.current = newFeature?.publisher.makeListner(listner => {
                listner.addHandler('valueChange', onFeatureChange);
            });
        return featureListner.current;
    }

    return (
    <div className='droppable-feature pt-4'>
        <div className="droppable-title mb-4 px-2 container-fluid">
            <div className="row justify-content-between">
                <div className="col-auto d-flex align-items-center">
                    <span className="fw-bolder">{feature.name}</span>
                    <span className="fw-bolder text-muted mx-2">{feature.epics.length}</span>
                </div>
                <div className="col-auto">
                    <Button className="delete-button" variant="light" size="sm" onClick={deleteFeatureClick}><FontAwesomeIcon icon={faTrashCan}/></Button>
                </div>
            </div>
        </div>

        <Droppable droppableId={`list-${feature.id}`}>
            {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps} style={epics.length == 0 ? {minHeight: '8px'} : undefined}>
                <DraggableEpicList epics={epics} rerenderer={epicsRender} deleteHandler={onDeleteEpic} />
                {provided.placeholder}
            </div>
            )}
        </Droppable>
        <button className="add-epic-button w-100 mt-4" onClick={onCreateEpicClick}>Add Epic + </button>
        
        <CreateEpicModal isVisible={isCreateEpicVisible} onVisibility={(visible)=>setCreateEpicVisible(visible)} onSubmit={createEpicSubmit} />
    </div>
    );
}

export { DroppableFeature }