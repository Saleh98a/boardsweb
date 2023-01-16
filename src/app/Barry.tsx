import PropTypes from 'prop-types';
import axios from 'axios';
import { string } from 'yup';

class User {
    id: number;
    role: string;
    name: string;
    image: string|null;

    public constructor(id: number, role: string, name: string, image: string|null){
        this.id = id;
        this.role = role;
        this.name = name;
        this.image = image;
    }

    isManager(): boolean {
        return this.role == 'manager';
    }

    isEmployee(): boolean {
        return this.role == 'employee' || this.role == 'manager';
    }

    isClient(): boolean {
        return this.role == 'client';
    }

}

class Manager extends User {

    
}

class Project {
    id: number
    managerId: number
    clientId: number|null;
    name: string
    createDate?: Date
  
    constructor(id: number, managerId: number, clientId: number, name: string, createDate?: Date) {
      this.id = id;
      this.managerId = managerId;
      this.clientId = clientId;
      this.name = name;
      this.createDate = createDate;
    }

    toFormdata(): FormData {
        let formData = new FormData();
        
        formData.append("managerId", this.managerId.toString());
        formData.append("name", this.name);
        if(this.createDate && this.createDate != null)
            formData.append("startDate", this.createDate!.toString());
        if(this.clientId && this.clientId != null)
            formData.append("clientId", this.clientId!.toString());

        return formData;
    }
  };

const BarryAPI = (function(){
    return { // public interface
        projects: {
            get: function(filter: {managerId?: number, clientId?: number} = {}, callback: (projects: Array<Project>, error: Error|null) => void){
                var params: {[key: string]: any;} = {};
                var keys = Object.keys(filter);
                var values = Object.values(filter);
                for (let index = 0; index < keys.length; index++){
                    if(values[index] !== undefined && values[index] != null)
                        params[keys[index]] = values[index];
                }

                fetch('http://localhost:8080/projects/?' + new URLSearchParams(params))
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        callback(data['data'], null);
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
                        if(data == null || !data['data'] || data['data'] == null)
                            return callback(null, new Error('Request returned with no project object'));
        
                        console.log(data);
                        callback(data['data'], null);
                    }).catch((err) => {
                        console.log(err);
                        callback(null, err);
                    });
            }
        }
    }
})();

const BarryApp = (function() {
    var privateVar = '';
  
    function privateMethod () {
      
    }
  
    return { // public interface
      currentUser: function (): User {
        // All private members are accessible here
        return new User(2, 'manager', 'Yasmin', null);
      },
    };
  })();

export { BarryApp, BarryAPI, Project };