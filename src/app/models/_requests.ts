import axios, { AxiosResponse } from "axios";
import { BarryResponse, Epic, Feature, Project } from "./_types";


const API_URL = process.env.REACT_APP_API_URL || 'api'

export const CREATE_PROJECT_URL = `${API_URL}/projects/`

export const CREATE_FEATURE_URL = `${API_URL}/features/`
export const DELETE_FEATURE_URL = `${API_URL}/features/`

export const CREATE_EPIC_URL = `${API_URL}/epics/`
export const DELETE_EPIC_URL = `${API_URL}/epics/`




export type CreateProjectParameters = {
    name: string,
    description?: string|undefined,
    clientId?: number|undefined
    startDate?: Date|undefined
    endDate?: Date|undefined
}

export function createProject(parmeters: CreateProjectParameters) {
    return axios.post(CREATE_PROJECT_URL, null ,{
        params: parmeters
    }).then((response) => {
        if(response && response.data){
            console.log('response:', response);
            const resp = new BarryResponse(Project, response.data);
            response.data = resp.data;
        }
        console.log('response:', response);
        return response;
    });
}





export type CreateFeatureParameters = {
    name: string,
    description?: string|undefined,
    projectId: number
    creatorId: number
}

export function createFeature(parmeters: CreateFeatureParameters) {
    return axios.post(CREATE_FEATURE_URL, null ,{
        params: parmeters
    }).then((response) => {
        if(response && response.data){
            console.log('response:', response);
            const resp = new BarryResponse(Feature, response.data);
            response.data = resp.data;
        }
        console.log('response:', response);
        return response;
    });
}


export type DeleteFeatureParameters = {
    featureId: string
}

export function deleteFeature(parmeters: DeleteFeatureParameters) {
    return axios.delete(DELETE_FEATURE_URL+`${parmeters.featureId}/`).then((response) => {
        toBarryResponse(response);
        console.log('response:', response);
        return response;
    });
}





export type CreateEpicParameters = {
    featureId: number,
    creatorId: number,

    name: string,
    description?: string|undefined,
    duration: number,

    startDate?: Date|undefined,
    startAfterId?: number|undefined
}

export function createEpic(parmeters: CreateEpicParameters) {
    return axios.post(CREATE_EPIC_URL, null ,{
        params: parmeters
    }).then((response) => {
        toBarryResponse(response, Epic);
        console.log('response:', response);
        return response;
    });
}


export type DeleteEpicParameters = {
    epicId: string
}

export function deleteEpic(parmeters: DeleteEpicParameters) {
    return axios.delete(DELETE_EPIC_URL+`${parmeters.epicId}/`).then((response) => {
        toBarryResponse(response);
        console.log('response:', response);
        return response;
    });
}





function toBarryResponse<T extends new (...a: any[])=> any>(response: AxiosResponse<any>, TCreator?: T|undefined): AxiosResponse<T> {
    if(!response || response === undefined || response === null)
        return response;

    if(response.data && TCreator){
        const resp = new BarryResponse(TCreator, response.data);
        response.data = resp.data;
    }

    return response;
}