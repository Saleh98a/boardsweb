import React, { EventHandler, FC, FormEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { BarryAPI, Project } from "../Barry";
import { useBarry } from "../BarryContext";
import { BarryEventListner } from "../models/BarryEventListner";

import { DropResult } from 'react-beautiful-dnd';
import { BarryObjectStore, Feature, Manager } from "../models/_types";
import { Button } from "react-bootstrap-v5";

import { CreateFeatureModal } from "../components/CreateFeatureModal";
import { ProjectBoard } from "../components/ProjectBoard";

import '../app.css'
import { TextSpan } from "typescript";

export type ProjectPageState = {
  project: Project,
  name: string;
}

export type ProjectProps = {

}

const ProjectPage: React.FC<ProjectProps> = ({ }) => {
  const location = useLocation();
  const { currentUser } = useBarry();
  const projectListner = useRef<BarryEventListner | undefined>(undefined);
  const [project, setProject] = useState((location.state as ProjectPageState ?? {}).project);
  const [projectName, setProjectName] = useState((location.state as ProjectPageState ?? {}).name);
  const [features, setFeatures] = useState<(Feature[] | undefined)>(undefined);
  const [featuresRender, setFeaturesRender] = useState<number>(0);

  console.log('PROJECT::project::user:', currentUser, 'project:', project);
  const [isCreateFeatureVisible, setCreateFeatureVisible] = useState(false);



  function registerToProject(newProject: Project | undefined, oldProject?: Project | undefined): BarryEventListner | undefined {
    if (!newProject || !(newProject instanceof Project)) {
      if (projectListner.current) {
        projectListner.current?.removeAllHandlers();
        oldProject && projectListner.current?.removeFromPublisher(oldProject.publisher);
        projectListner.current = undefined;
      }
      return undefined;
    } else if (!projectListner.current && newProject)
      projectListner.current = newProject?.publisher.makeListner(listner => {
        listner.addHandler('valueChange', onProjectChange);
      });
    return projectListner.current;
  }

  function onProjectChange(event: string, target: Project, options: any | undefined) {
    if (target === project && options && options.name === 'features') {
      console.log('publisher::project:onProjectChange(\'' + event + '\', target:', target, 'options:', options);
      setFeatures(project.features);
      setFeaturesRender(Math.random() * 100000);
    }
  }

  function projectNameChanged(event: FormEvent<HTMLSpanElement>) {
    let newName = event.currentTarget.textContent;
    console.log('projectNameChanged', newName);

    BarryAPI.projects.update(project, currentUser?.id!, newName!, (result, error) => {
      if (!result) {
        alert('name change failed');
      } else {
        setProjectName(newName!);
      }
    });
  }

  function restoreProject(oldProject: Project | undefined): Project | undefined {
    if (oldProject && (typeof oldProject === 'object') && oldProject instanceof Project) {
      return oldProject;
    }

    // The given project isn't a Project instance.
    const _oldProject: any = project as any;
    registerToProject(undefined, _oldProject);

    if (typeof _oldProject === 'object' && _oldProject.id && typeof _oldProject.id === 'number') {
      // Given an object with Id property.
      const prjct = BarryObjectStore.Instance.get('project', _oldProject.id);
      if (prjct && prjct instanceof Project) {
        // Decoded project from current active session.
        registerToProject(prjct);
        return prjct as Project;
      } else {
        const prjct = BarryObjectStore.Instance.decode(Project, _oldProject);
        if (prjct && prjct instanceof Project) {
          registerToProject(prjct);
          return prjct;
        }
      }
    }

    // If got here, then couln't load project from current session, should fetch it from backend.
    // ...
  }

  useEffect(() => {

    let newProject: Project | undefined = restoreProject(project);

    if (newProject && newProject !== project) {
      setProject(newProject);
      setProjectName(newProject.name!);
      setFeatures(newProject?.features ?? []);
    } else {
      registerToProject(newProject);
    }

    return () => {
      projectListner.current?.removeFromPublisherWithHandlers(project?.publisher, undefined, projectListner);
      console.log('publisher::project:unmount', project, 'listner:', projectListner.current);
    }
  }, [project, projectName]);

  useEffect(() => {

    let newProject: Project | undefined = restoreProject(project);
    if (newProject && (!features || features === undefined || typeof features === 'undefined'))
      setFeatures(newProject?.features ?? []);

  }, [features])

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    // const quotes = reorder(
    //   state.quotes,
    //   result.source.index,
    //   result.destination.index
    // );

    // setState({ quotes, quotes2: state.quotes2 });
  }

  function createFeature() {
    // Create a new feature.
    console.log('PROJECT::Feature:');
    if (!project || !currentUser || !(currentUser instanceof Manager))
      return;

    setCreateFeatureVisible(true);

  }

  function createFeatureSubmit(feature: { name: string, description?: string | undefined }) {
    if (!feature || !feature.name || feature.name.trim().length <= 0) {
      alert('Invalid Feature');
      return;
    } else if (!project || !currentUser || !(currentUser instanceof Manager)) {
      alert('Your\'nt authurized to make this action');
      return;
    }

    project.create(feature, currentUser).then((feature) => {
      // Handle adding a new feature.
      console.log('PROJECT::Feature:', feature);
    }).catch((error) => {
      console.log('PROJECT::Feature:error:', error);
    });
  }

  function deleteFeature(feature: Feature, i: number) {
    if (!feature) return;
    // Perform delete feature here.
    if (!project) {
      alert('Cannot delete feature: ' + feature.name);
      return;
    }

    project.delete(feature);
  }

  return (
    <>
      <div className='full-width-page page-white'>
        <div className='full-width-child d-flex flex-wrap flex-stack mb-6'>
          <h3 className='fw-bolder my-2'>
            <span className='fw-bolder single-line'
              contentEditable
              onBlur={projectNameChanged}
              onKeyPress={(e) => { if (e.key === 'Enter') projectNameChanged(e) }}>{projectName}</span>
            <span className="mx-4">-</span>
            <span className="fw-normal text-muted">{features?.length ?? 0} Features</span>
          </h3>
        </div>

        <CreateFeatureModal isVisible={isCreateFeatureVisible} onVisibility={(visible) => setCreateFeatureVisible(visible)} onSubmit={createFeatureSubmit} />
        <ProjectBoard onDragEnd={onDragEnd} features={features} rerender={featuresRender} createFeature={() => setCreateFeatureVisible(true)} deleteFeature={deleteFeature} />
      </div>
    </>)
}


export default ProjectPage;