import React, { FC, useEffect, useRef, useState } from "react";
import '../app.css'

import styled from '@emotion/styled'
import { Droppable, Draggable, DropResult, OnDragEndResponder } from 'react-beautiful-dnd';
import { Epic, Feature, Manager } from "../models/_types";
import { Button } from "react-bootstrap-v5";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { BarryEventListner } from "../models/BarryEventListner";
import { useBarry } from "../BarryContext";


const grid = 8;

const QuoteItem = styled.div`
    width: 200px;
    border: 1px solid grey;
    margin-bottom: ${grid}px;
    background-color: lightblue;
    padding: ${grid}px;
    `;



function DraggableEpic({ epic, index }: {epic: Epic; index: number}) {
    return (
        <Draggable draggableId={`${epic.id}`} index={index}>
        {provided => (
            <QuoteItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            >
            {epic.name}
            </QuoteItem>
        )}
        </Draggable>
    );
}

const DraggableEpicList: FC<{epics: Epic[]}> = ({epics}) => {
    return (
    <>{epics.map((epic: Epic, index: number) => (
        <DraggableEpic epic={epic} index={index} key={epic.id} />
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


    useEffect(() => {
        registerToFeature(feature);

        return () => {
            featureListner.current?.removeFromPublisherWithHandlers(feature?.publisher, undefined, featureListner);
            console.log('publisher::feature:unmount', feature, 'listner:', featureListner.current);
        }
    })


    function onFeatureChange(event: string, target: Feature, options: any|undefined){
        if(target === feature && options && options.name === 'epics'){
            console.log('publisher::project:onProjectChange(\'' + event + '\', target:', target, 'options:', options);
            setEpics(feature.epics);
            setEpicsRender(Math.random()*100000);
        }
    }

    function deleteFeatureClick(){
        deleteFeature && deleteFeature(feature, index);
    }

    function onCreateEpicClick(){
        createEpicHandler && createEpicHandler(feature, index);

        if(feature && feature instanceof Feature && currentUser && (currentUser instanceof Manager)){
            feature.create({
                name: 'Unnamed Epic',
                description: 'Blank',
                duration: 120
            }, currentUser);
        }
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
            <div ref={provided.innerRef} {...provided.droppableProps}>
                <DraggableEpicList epics={epics} />
                {provided.placeholder}
            </div>
            )}
        </Droppable>
        <button className="add-epic-button w-100 mt-4" onClick={onCreateEpicClick}>Add Epic + </button>
        </div>
    );
}

export { DroppableFeature }