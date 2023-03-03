
import '../app/models/_types';
import { User, Employee, Project, Manager, PersonRole, BarryResponse } from '../app/models/_types';
import { createContext, FC, PropsWithChildren } from 'react';


type ProjectFilter = {
    projectId?: number,
    managerId?: number,
    clientId?: number
} 
const BarryAPI = (function(){
    return { // public interface
        projects: {
            get: function(filter: ProjectFilter = {}, callback: (projects: Array<Project>, error: Error|null) => void){
                var params: {[key: string]: any;} = {};
                var keys = Object.keys(filter);
                var values = Object.values(filter);
                for (let index = 0; index < keys.length; index++){
                    if(values[index] !== undefined && values[index] != null)
                        params[keys[index]] = values[index];
                }

                let url = 'http://localhost:8080/projects/' + ((filter.projectId && !isNaN(filter.projectId!)) ? ''+filter.projectId!+'/' : '');
                console.log('url', url);
                fetch(url +'?' + new URLSearchParams(params))
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        const resp = new BarryResponse(Project, data);
                        console.log('response:', resp);
                        if(Array.isArray(data['data'])){
                            callback(data['data'], null);
                        } else {
                            callback([data['data']], null);
                        }
                    })
                    .catch((err) => {
                        console.log(err.message);
                        callback(new Array<Project>(), err);
                    });
            },
    
            create: function(newProject: Project, callback: (project: Project|null, error: Error|null) => void){
                if(!newProject || newProject == null)
                    return callback(null, new Error('Missing project object')); 
        
                fetch('http://localhost:8080/projects', {method: 'POST', body: newProject.toFormdata()})
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('data:', data);
                        if(data == null || !data['data'] || data['data'] == null)
                            return callback(null, new Error('Request returned with no project object'));
        
                        console.log(data);
                        callback(data['data'], null);
                    }).catch((err) => {
                        console.log(err);
                        callback(null, err);
                    });
            }
        },
        
    }
})();

const BarryApp = (function() {
    var privateVar = '';
  
    function privateMethod () {
      
    }
  
    return { // public interface
      currentUser: function (): User {
        // All private members are accessible here
        return new Manager({
            id: 2,
            name: 'Frodo Baggins',
            email: 'manager@panel.com',
            role: PersonRole.Manager,
        });
      },
    };
  })();

export { BarryApp, BarryAPI, Project };