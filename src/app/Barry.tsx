
import '../app/models/_types';
import { User, Employee, Project, Manager, PersonRole, BarryResponse, Epic, Feature } from '../app/models/_types';
import { createContext, FC, PropsWithChildren } from 'react';


type ProjectFilter = {
    projectId?: number,
    managerId?: number,
}

type AssignmentFilter = {
    employeeId?: number
}

const BarryAPI = (function () {
    return { // public interface
        projects: {
            get: function (filter: ProjectFilter = {}, callback: (projects: Array<Project>, error: Error | null) => void) {
                var params: { [key: string]: any; } = {};
                var keys = Object.keys(filter);
                var values = Object.values(filter);
                for (let index = 0; index < keys.length; index++) {
                    if (values[index] !== undefined && values[index] != null)
                        params[keys[index]] = values[index];
                }

                let url = 'http://localhost:8080/projects/' + ((filter.projectId && !isNaN(filter.projectId!)) ? '' + filter.projectId! + '/' : '');
                console.log('url', url);
                fetch(url + '?' + new URLSearchParams(params))
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        const resp = new BarryResponse(Project, data);
                        console.log('response:', resp);
                        if (Array.isArray(data['data'])) {
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

            create: function (newProject: Project, callback: (project: Project | null, error: Error | null) => void) {
                if (!newProject || newProject == null)
                    return callback(null, new Error('Missing project object'));

                fetch('http://localhost:8080/projects', { method: 'POST', body: newProject.toFormdata() })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('data:', data);
                        if (data == null || !data['data'] || data['data'] == null)
                            return callback(null, new Error('Request returned with no project object'));

                        console.log(data);
                        callback(data['data'], null);
                    }).catch((err) => {
                        console.log(err);
                        callback(null, err);
                    });
            },

            update: function (project: Project, managerId: number, name: string, callback: (result: boolean | null, error: Error | null) => void) {
                if (!project || project == null)
                    return callback(false, new Error('Missing project object'));

                const formData = new FormData();
                formData.append('name', name);
                formData.append('managerId', managerId.toString());

                fetch('http://localhost:8080/projects/' + project.id, { method: 'PUT', body: formData })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('data:', data);
                        if (data == null || !data['data'] || data['data'] == null)
                            return callback(false, new Error('Request returned with no project object'));

                        console.log(data);
                        callback(data['data'], null);
                    }).catch((err) => {
                        console.log(err);
                        callback(null, err);
                    });
            }
        },

        features: {
            update: function (feature: Feature, managerId: number, name: string, callback: (result: boolean | null, error: Error | null) => void) {
                if (!feature || feature == null)
                    return callback(false, new Error('Missing project object'));

                const formData = new FormData();
                formData.append('name', name);
                formData.append('managerId', managerId.toString());

                fetch('http://localhost:8080/features/' + feature.id, { method: 'PUT', body: formData })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('data:', data);
                        if (data == null || !data['data'] || data['data'] == null)
                            return callback(false, new Error('Request returned with no feature object'));

                        console.log(data);
                        callback(data['data'], null);
                    }).catch((err) => {
                        console.log(err);
                        callback(null, err);
                    });
            }
        },

        epics: {
            get: function (filter: AssignmentFilter = {}, callback: (projects: Array<Epic>, error: Error | null) => void) {
                var params: { [key: string]: any; } = {};
                var keys = Object.keys(filter);
                var values = Object.values(filter);
                for (let index = 0; index < keys.length; index++) {
                    if (values[index] !== undefined && values[index] != null)
                        params[keys[index]] = values[index];
                }

                let url = 'http://localhost:8080/assignments/' + ((filter.employeeId && !isNaN(filter.employeeId!)) ? '' + filter.employeeId! + '/' : '');
                console.log('url', url);
                fetch(url + '?' + new URLSearchParams(params))
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        const resp = new BarryResponse(Project, data);
                        console.log('response:', resp);
                        if (Array.isArray(data['data'])) {
                            callback(data['data'].map(a => a.epic), null);
                        } else {
                            callback([data['data']].map(a => a.epic), null);
                        }
                    })
                    .catch((err) => {
                        console.log(err.message);
                        callback(new Array<Epic>(), err);
                    });
            },

            create: function (newProject: Project, callback: (project: Project | null, error: Error | null) => void) {
                if (!newProject || newProject == null)
                    return callback(null, new Error('Missing project object'));

                fetch('http://localhost:8080/assignments', { method: 'POST', body: newProject.toFormdata() })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('data:', data);
                        if (data == null || !data['data'] || data['data'] == null)
                            return callback(null, new Error('Request returned with no project object'));

                        console.log(data);
                        callback(data['data'], null);
                    }).catch((err) => {
                        console.log(err);
                        callback(null, err);
                    });
            },

            update: function (epic: Epic, managerId: number, name: string, callback: (result: boolean | null, error: Error | null) => void) {
                if (!epic || epic == null)
                    return callback(false, new Error('Missing epic object'));

                const formData = new FormData();
                formData.append('name', name);
                formData.append('managerId', managerId.toString());

                fetch('http://localhost:8080/epics/' + epic.id, { method: 'PUT', body: formData })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('data:', data);
                        if (data == null || !data['data'] || data['data'] == null)
                            return callback(false, new Error('Request returned with no epic object'));

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

const BarryApp = (function () {
    var privateVar = '';

    function privateMethod() {

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