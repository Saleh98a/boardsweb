import axios from "axios";
import { BarryResponse, Project } from "./_types";


const API_URL = process.env.REACT_APP_API_URL || 'api'

export const CREATE_PROJECT_URL = `${API_URL}/projects/`




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