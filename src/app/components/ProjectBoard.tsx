import React, { FC, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Project } from "../Barry";
import { useBarry } from "../BarryContext";
import '../app.css'

import styled from '@emotion/styled'
import { DragDropContext, Droppable, Draggable, DropResult, OnDragEndResponder, ResponderProvided } from 'react-beautiful-dnd';
import { BarryObjectStore, Epic, Feature, Manager } from "../models/_types";
import { Button, Form, Modal } from "react-bootstrap-v5";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { BarryEventListner } from "../models/BarryEventListner";

import { DroppableFeature } from './DroppableFeature';

export type ProjectBoardProps = {
  features?: Feature[] | undefined
  rerender?: number | undefined
  addFeatureColumn?: boolean | undefined
  onDragEnd: OnDragEndResponder
  deleteFeature?: ((feature: Feature, i: number) => void) | undefined
  createFeature?: (() => void) | undefined
}

type ProjectBoardState = {
  features?: Feature[] | undefined
  rerender?: number | undefined
  addFeatureColumn: boolean
}

const ProjectBoard: FC<ProjectBoardProps> = ({ features, rerender, addFeatureColumn, onDragEnd, deleteFeature, createFeature }) => {
  const [state, setState] = useState<ProjectBoardState>({ features: [], addFeatureColumn: addFeatureColumn !== false });

  useEffect(() => {

    console.log('ProjectBoard::useEffect:', features, 'renderer=\'' + rerender + '\'', 'state:', state);
    if (features !== state?.features)
      setState({ features: features, rerender: rerender, addFeatureColumn: addFeatureColumn !== false });
    else if (rerender !== state.rerender)
      setState({ features: features, rerender: rerender, addFeatureColumn: addFeatureColumn !== false });
    else if ((addFeatureColumn !== false && !state.addFeatureColumn) || addFeatureColumn !== state.addFeatureColumn)
      setState({ features: features, rerender: rerender, addFeatureColumn: addFeatureColumn !== false });

  }, [features, rerender, addFeatureColumn])


  function onCreateEpicClick() {
  }

  function getFeatureOfId(featureId: number | string | undefined, feature?: Feature | undefined): Feature | undefined {
    if (featureId === undefined || featureId === null || typeof featureId !== 'number' || isNaN(featureId)) {
      if (typeof featureId === 'string' && parseInt(featureId) && !isNaN(parseInt(featureId)))
        return getFeatureOfId(parseInt(featureId), feature);
      return undefined;
    } else if (featureId < 0)
      return undefined;
    else if (feature && feature.id === featureId)
      return feature;

    for (let i = 0; i < (state.features?.length ?? 0); i++)
      if (state.features![i] && state.features![i].id === featureId)
        return state.features![i];

    return undefined;
  }

  function onEpicDragEnd(result: DropResult, provided: ResponderProvided) {
    onDragEnd && onDragEnd(result, provided);

    if (result && result.source && result.destination) {
      const sourceDroppableId = result.source.droppableId.split('-').pop();
      const destinationDroppableId = result.destination.droppableId.split('-').pop();

      const sFeature = getFeatureOfId(sourceDroppableId);
      const dFeature = getFeatureOfId(destinationDroppableId, sFeature);

      if (!sFeature || !dFeature)
        return; // Invalid Action.

      const sIndex = result.source.index;
      const dIndex = result.destination.index;
      if (sFeature === dFeature) {
        if (sIndex === dIndex)
          return; // Returned to same position.

        sFeature.moveEpic(sIndex, dIndex);
      } else {
        const epic = sFeature.getEpicAt(sIndex);
        if (!epic)
          return; // There's no such epic to move.

        sFeature.removeEpic(epic);
        dFeature.addEpic(epic, dIndex);
      }
    }
  }

  return (
    <div className="container-fluid px-0 mx-0 h-100 overflow-scroll">
      <DragDropContext onDragEnd={onEpicDragEnd}>
        <div className="full-width-child row d-flex flex-nowrap h-100 mb-8">
          {
            (state.features ?? []).map((feature, index) => {
              return (
                <div className="col-auto" key={index}>
                  {<DroppableFeature feature={feature} index={index} deleteFeature={deleteFeature} createEpicHandler={onCreateEpicClick} />}
                </div>
              )
            })
          }
          {
            state.addFeatureColumn && <div className='col-auto' style={{ width: '256px' }}>
              <button className="add-feature-button w-100" onClick={createFeature}>Add Feature + </button>
            </div>
          }
        </div>
      </DragDropContext>
    </div>
  );
}

export { ProjectBoard }