import PropTypes from 'prop-types';

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

class Project {
    id: number
    firstName: string
    createDate?: Date
  
    constructor(id: number, firstName: string, createDate?: Date) {
      this.id = id;
      this.firstName = firstName;
      this.createDate = createDate;
    }
  };

const BarryAPI = (function(){
    return { // public interface
        getProjects: function(callback: (projects: Array<Project>, error: Error|null) => void){
            fetch('http://localhost:8080/projects')
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

        createNewProject: function(newProject: Project, callback: (projects: Array<Project>, error: Error|null) => void){
            const params = {
                'managerId': BarryApp.currentUser().id,
                'name': newProject.firstName,
                //'startDate': newProject.createDate,
                'clientId': 3
            };
            const options = {
                method: 'POST',
                body: JSON.stringify(params)  
            };
            fetch('http://localhost:8080/projects/', options)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    callback(data['data'], null);
                })
                .catch((err) => {
                    console.log(err.message);
                });
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
        return new User(1, 'manager', 'Yasmin', null);
      },
    };
  })();

export { BarryApp, BarryAPI, Project };