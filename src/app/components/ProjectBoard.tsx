import React, { FC, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Project } from "../Barry";
import { useBarry } from "../BarryContext";
import '../app.css'

import styled from '@emotion/styled'
import { DragDropContext, Droppable, Draggable, DropResult, OnDragEndResponder } from 'react-beautiful-dnd';
import { BarryObjectStore, Epic, Feature, Manager } from "../models/_types";
import { Button, Form, Modal } from "react-bootstrap-v5";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { BarryEventListner } from "../models/BarryEventListner";

import { DroppableFeature } from './DroppableFeature'; 

export type ProjectBoardProps = {
  features?: Feature[]|undefined
  rerender?: number|undefined
  addFeatureColumn?: boolean|undefined
  onDragEnd: OnDragEndResponder
  deleteFeature?: ((feature: Feature, i: number)=>void)|undefined
  createFeature? : (()=>void)|undefined
}
  
type ProjectBoardState = {
  features?: Feature[]|undefined
  rerender?: number|undefined
  addFeatureColumn: boolean
}
  
const ProjectBoard: FC<ProjectBoardProps> = ({features, rerender, addFeatureColumn, onDragEnd, deleteFeature, createFeature}) => {
  const [state, setState] = useState<ProjectBoardState>({features: [], addFeatureColumn: addFeatureColumn !== false});

  useEffect(()=> {

    console.log('ProjectBoard::useEffect:', features, 'state:', state);
    if(features !== state?.features)
      setState({ features: features, rerender: rerender, addFeatureColumn: addFeatureColumn !== false });
    else if(rerender !== state.rerender)
      setState({features: features, rerender: rerender, addFeatureColumn: addFeatureColumn !== false});
    else if((addFeatureColumn !== false && !state.addFeatureColumn) || addFeatureColumn !== state.addFeatureColumn)
      setState({features: features, rerender: rerender, addFeatureColumn: addFeatureColumn !== false});

  }, [features, rerender, addFeatureColumn])


  function onCreateEpicClick(){
  }

  return (
    <div className="container-fluid px-0 mx-0 h-100 overflow-scroll">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="full-width-child row d-flex flex-nowrap h-100 mb-8">
          {
            state.features?.map((feature, index) => {
              return(
                <div className="col-auto"key={index}>
                  {<DroppableFeature feature={feature} index={index} deleteFeature={deleteFeature} createEpicHandler={onCreateEpicClick} />}
                </div>
              )
            })
          }
          {
          state.addFeatureColumn && <div className='col-auto' style={{width: '256px'}}>
            <button className="add-feature-button w-100" onClick={createFeature}>Add Feature + </button>
          </div>
          }
        </div>
      </DragDropContext>
    </div>
  );
}

export { ProjectBoard }