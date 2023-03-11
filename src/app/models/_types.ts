import { createEpic, createFeature, createProject, deleteEpic, deleteFeature } from "./_requests";
import { BarryEventPublisher } from './BarryEventListner';

export interface BarryObject {
    id: number;
    get getObjectType(): string|undefined;
    publisher: BarryEventPublisher;

    merge(props: any): void;
}

export function isInstanceOfBarry(object: any, data?: any): object is BarryObject {
    if('getObjectType' in object || (object.prototype && 'getObjectType' in object.prototype)){
        if(data && data.id && !isNaN(data.id))
            return true;
        return data === undefined;
    }

    return false;
}


export class BarryObjectStore {
    private static _instance: BarryObjectStore;


    store: { [key: string]: { [key: number]: BarryObject } } = {};

    private constructor(){
        //...
    }

    public static get Instance(){
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }


    public get(objectType: string, id: number): BarryObject|undefined {
        if(!this.store[objectType])
            return undefined;
        return this.store[objectType][id];
    }

    public add<BarryObj extends BarryObject>(newObject: BarryObj): BarryObj {
        const objectType = newObject.getObjectType;
        if(objectType){
            const storedObject = this.get(objectType, newObject.id);
            if(storedObject && typeof(storedObject) === objectType){
                return this.store[objectType][newObject.id] as BarryObj;
            } else {
                if(!this.store[objectType])
                    this.store[objectType] = {};

                this.store[objectType][newObject.id] = newObject;
                return newObject;
            }
        } else {
            throw Error("Cannot store an object that's not of type `BarryObject` in BarryObjectStore.");
        }
    }

    public decode<T extends new (...a: any[])=> any>(TCreator: T, props: any): T {
        if(!isInstanceOfBarry(TCreator, props) || !props || !props.id || isNaN(props.id)){
            if(props instanceof TCreator)
                return props;
            return new TCreator(props);
        }
        
        const objectType: string|undefined = TCreator.prototype.getObjectType;
        if(!objectType || objectType.length === 0){
            // There's no barry object type specified.
            if(props instanceof TCreator)
                return props;
            return new TCreator(props);
        }

        const id: number = props.id;
        const stored: BarryObject|undefined = this.get(objectType, id);

        if(!stored){
            // There's no stored object.
            if(props instanceof TCreator){
                this.add(props);
                return props;
            } else {
                const decoded: T = new TCreator(props);
                const br: BarryObject = decoded as any;
                this.add(br);
                return decoded;
            }
        } else {
            // There's a stored object, merge and return the existing object.
            stored.merge(props);
            return (stored as any) as T;
        }
    }

    public decodeArray<T extends new (...a: any[])=> any>(TCreator: T, props: any): Array<T> {
        return ((): Array<T> => {
            if(!props || props === null || props === undefined || typeof props === 'undefined'){
                return [];
            } else if(Array.isArray(props)){
                return props.map(function(value: any): T {
                    return (BarryObjectStore.Instance.decode(TCreator, value) ?? (new TCreator(value))) as any;
                })
            } else {
                const decoded = BarryObjectStore.Instance.decode(TCreator, props) as any;
                return decoded !== undefined ? [decoded!] : [];
            }
        })();
    }

    // ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null 
    onfulfilled?: (data: any) => any = function(data: any): any {
        if(data instanceof BarryObjectStore){
            
        }
    }
}

export const barryObjectStore = BarryObjectStore.Instance;




export interface BarryResponseProps {
    status: boolean
    errorCode?: number
    errorMessage?: string
    data?: any
}

export class BarryResponse<T extends new (...a: any[])=> any> {
    status: boolean;
    errorCode: number;
    errorMessage: string|undefined;
    data: Array<T>;

    public constructor(TCreator: T, props: BarryResponseProps){
        let foundKeys: Array<string> = new Array<string>();
        if(props.status !== undefined){
            // There's a status key.
            this.status = props.status;
            foundKeys.push('status');
            this.errorMessage = props.errorMessage && props.errorMessage.length > 0 ? props.errorMessage! : undefined;
            if(props.errorCode !== undefined && !isNaN(props.errorCode)){
                // There's an error code.
                this.errorCode = props.errorCode!;
                foundKeys.push('code');
            } else {
                // There's no error code.
                this.errorCode = this.status ? 0 : -1;
            }
        } else if(props.errorCode !== undefined && !isNaN(props.errorCode)){
            // There's no status key, but there's an error code.
            foundKeys.push('code');
            this.errorMessage = props.errorMessage && props.errorMessage.length > 0 ? props.errorMessage! : undefined;
            if(props.errorCode !== 0){
                // The error code has an error value.
                this.status = false;
                this.errorCode = props.errorCode!;
            } else {
                // There's no status key, but there's an error code and it's zero.
                this.status = true;
                this.errorCode = 0;
            }
        } else {
            // There's no status key, nor an ereor code.
            this.status = true;
            this.errorCode = 0;
            this.errorMessage = props.errorMessage && props.errorMessage.length > 0 ? props.errorMessage! : undefined;
        }

        if(props.errorMessage && props.errorMessage.length > 0)
            foundKeys.push('message');

        if(props.data){
            // There's a data key.
            if(Array.isArray(props.data)){
                this.data = props.data!.map(function(value: any): T {
                    return BarryObjectStore.Instance.decode(TCreator, value) ?? (new TCreator(value));
                })
            } else {
                const decoded = BarryObjectStore.Instance.decode(TCreator, props.data);
                this.data = decoded !== undefined ? [decoded!] : [];
            }
        } else {
            const prs: any = props;
            if(Array.isArray(prs)){
                this.data = prs.map(function(value: any): T {
                    return BarryObjectStore.Instance.decode(TCreator, value) ?? (new TCreator(value));
                })
            } else {
                const decoded = BarryObjectStore.Instance.decode(TCreator, props.data);
                this.data = decoded !== undefined ? [decoded!] : [];
            }
        }
    }

}



function OfType<T, U>(list: T[], arg: Function) : U[]{
    var result: U[] = [];

    list.forEach(e => {
        // extract the name of the class
        // used to match primitive types
        var a =  /function\s*([^(]*)/i.exec(arg+"");
        if(!a || a.length <= 0)
            return;

        var typeName = a[1].toLocaleLowerCase();
        var isOfType = typeof(e) === typeName;

        // if it is not primitive or didn't match the type
        // try to check if it is an instanceof
        if (!isOfType){
            try {
                isOfType = (e instanceof arg)
            }
            catch (ex) { }
        }

        if (isOfType)
            result.push(<U><any>e);
    });

    return <any[]>result;
}



export enum PersonRole {
    Employee,
    Manager,
    Client
}

export interface PersonProps {
    id: number;
    email: string;
    role?: PersonRole;
    name?: string;
    firstName?: string;
    lastName?: string
    pic?: string;
}

export interface Person {
    id: number;
    role: PersonRole;
    email: string;
    name: string|undefined;
    firstName: string|undefined;
    lastName: string|undefined;
    pic: string|undefined;
}



export interface UserProps extends PersonProps {
}

export class User implements Person, BarryObject {
    id: number;
    role: PersonRole;
    email: string;
    name: string | undefined;
    firstName: string|undefined;
    lastName: string|undefined;
    pic: string | undefined;
    publisher: BarryEventPublisher;

    public constructor(props: UserProps){
        if(props.id && typeof props.id !== 'undefined'){
            this.id = props.id;
        } else if((props as any).accountId && typeof (props as any).accountId !== 'undefined'){
            this.id = (props as any).accountId;
        } else {
            this.id = props.id;
        }
        this.role = props.role ?? PersonRole.Employee;
        this.email = props.email;
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.name = props.name;
        this.pic = props.pic;
        this.publisher = new BarryEventPublisher();

        if(!props.name || props.name!.length === 0){
            // There's no full name property.
            if(props.firstName && props.firstName!.length > 0 && props.lastName && props.lastName!.length > 0){
                this.name = props.firstName! + ' ' + props.lastName!;
            } else if(props.firstName && props.firstName!.length > 0){
                this.name = props.firstName!
            } else if(props.lastName && props.lastName!.length > 0){
                this.name = props.lastName!
            } else {
                this.name = undefined;
            }
        }
    }

    get getObjectType(): string | undefined {
        return 'user';
    }

    get roleString(): string|undefined {
        switch (this.role) {
            case PersonRole.Employee:
                return "Employee";
            case PersonRole.Manager:
                return "Manager";
            case PersonRole.Client:
                return "Client";
            default:
                return undefined;
        }
    }

    merge(props: any): void {
        // Merge new object here.
    }

    isManager(): boolean {
        return this.role == PersonRole.Manager;
    }

    isEmployee(): boolean {
        return this.role == PersonRole.Employee || this.role == PersonRole.Manager;
    }

    isClient(): boolean {
        return this.role == PersonRole.Client;
    }
    
}



export interface EmployeeProps extends UserProps {
    projects?: Array<Project>
}

export class Employee extends User {
    projects: Array<Project>

    public constructor(props: EmployeeProps){
        props.role = !props || props.role === undefined || typeof props.role === 'undefined' ? PersonRole.Employee : props.role;
        super(props);

        this.projects = ((): Array<Project> => {
            if(!props.projects){
                return [];
            } else if(Array.isArray(props.projects)){
                return props.projects.map(function(value: any): Project {
                    return (BarryObjectStore.Instance.decode(Project, value) ?? (new Project(value))) as any;
                })
            } else {
                const decoded = BarryObjectStore.Instance.decode(Project, props.projects) as any;
                return decoded !== undefined ? [decoded!] : [];
            }
        })();
    }

    override get getObjectType(): string|undefined {
        return 'employee';
    }

    public addProject(project: Project){
        // Add project here.
        this.projects.push(project);
    }
}



export interface ManagerProps extends EmployeeProps {
}

export class Manager extends Employee implements ManagerProps {

    public constructor(props: ManagerProps){
        props.role = !props || props.role === undefined || typeof props.role === 'undefined' ? PersonRole.Manager : props.role;
        super(props);

        this.projects.forEach(project => {
            project.setManager(this);
        })
    }

    override get getObjectType(): string|undefined {
        return 'manager';
    }

    public override addProject(project: Project): void {
        project.setManager(this);
        super.addProject(project);
    }

    create(project: CreateProjectParameters, client?: Client|undefined){
        return createProject({...project, ...{managerId: this.id, clientId: client?.id ?? 3}}).then(projects => {
            projects.data.forEach((pr: any)=>{
                this.addProject(pr);
            })
            return projects;
        })
    }
}

export interface CreateProjectParameters {
    name: string,
    description?: string|undefined,
    startDate?: Date|undefined
    endDate?: Date|undefined
}

export interface CreateFeatureParameters {
    name: string,
    description?: string|undefined
}

export interface CreateEpicParameters {
    name: string,
    description?: string|undefined,
    duration: number,

    startDate?: Date|undefined,
    startAfterId?: number|undefined
}



export interface ClientProps extends UserProps {
    projects?: Array<Project>
}

export class Client extends User {
    projects: Array<Project>

    public constructor(props: ClientProps){
        props.role = !props || props.role === undefined || typeof props.role === 'undefined' ? PersonRole.Client : props.role;
        super(props);
        this.projects = this.projects = ((): Array<Project> => {
            if(!props.projects){
                return [];
            } else if(Array.isArray(props.projects)){
                return props.projects.map(function(value: any): Project {
                    return (BarryObjectStore.Instance.decode(Project, value) ?? (new Project(value))) as any;
                })
            } else {
                const decoded = BarryObjectStore.Instance.decode(Project, props.projects) as any;
                return decoded !== undefined ? [decoded!] : [];
            }
        })();
    }

    override get getObjectType(): string|undefined {
        return 'client';
    }
}





export interface ProjectItemProps {
    id: number
    name?: string
    description?: string
    createDate: Date
    lastModified?: Date
    creator?: Person
}

export abstract class ProjectItem implements BarryObject {
    id: number
    name: string|undefined
    description?: string|undefined
    createDate: Date
    lastModified: Date|undefined
    creator: Person|undefined
    publisher: BarryEventPublisher;

    public constructor(props: ProjectItemProps){
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
        this.createDate = props.createDate;
        this.creator = props.creator;
        this.publisher = new BarryEventPublisher();
    }

    abstract get getObjectType(): string|undefined;
    abstract merge(props: any): void;
}





export interface EpicProps extends ProjectItemProps {
    feature?: Feature
}

export class Epic extends ProjectItem {
    feature: Feature|undefined
    private _featureId: number|undefined = undefined;

    public constructor(props: EpicProps){
        super(props);

        const ftr: any|undefined = props.feature ? BarryObjectStore.Instance.decode(Feature, props.feature!) : undefined;
        this.feature = ftr ?? BarryObjectStore.Instance.get('feature', (props as any).featureId);
        this._featureId = this.feature?.id ?? (props as any).featureId;
    }

    get getObjectType(): string|undefined {
        return 'epic';
    }

    merge(props: any): void {
        // Merge new object here.
    }

    setFeature(feature: Feature|undefined){
        this.feature = feature;
        this._featureId = feature?.id;
    }
}





export interface FeatureProps extends ProjectItemProps {
    project?: Project
    epics?: Array<Epic>
}

export class Feature extends ProjectItem {
    project: Project|undefined
    epics: Array<Epic>
    private _projectId: number|undefined = undefined;
    
    public constructor(props: FeatureProps){
        super(props);
        
        this.epics = BarryObjectStore.Instance.decodeArray(Epic, props.epics) as any;

        const prgct: any|undefined = props.project ? BarryObjectStore.Instance.decode(Project, props.project!) : undefined;
        this.project = prgct ?? BarryObjectStore.Instance.get('project', (props as any).projectId);
        this._projectId = this.project?.id ?? (props as any)?.projectId;
    }

    get getObjectType(): string|undefined {
        return 'feature';
    }

    merge(props: any): void {
        // Merge new object here.
    }

    setProject(project: Project|undefined){
        this.project = project;
        this._projectId = project?.id;
    }

    public addEpic(epic: Epic): void {
        if(epic.feature !== this){
            // Feature already belongs to another project, remove it from other project.
            epic?.feature?.removeEpic(epic);
        }

        epic.setFeature(this);
        this.epics.push(epic);
        
        this.publisher.fire('valueChange', this, {
            oldValue: undefined,
            newValue: this.epics,
            name: 'epics',
            arrayEvent: {
                item: epic,
                index: this.epics.length,
                count: 1,
                multiplier: 1,
                type: 'insert'
            }
        })
    }

    public removeEpic(epic: Epic): void {
        if(!epic) return;

        const i = this.epics.indexOf(epic);
        if(i >= 0 && i <= this.epics.length){
            this.epics.splice(i, 1);
            epic?.setFeature(undefined);

            this.publisher.fire('valueChange', this, {
                oldValue: undefined,
                newValue: this.epics,
                name: 'epics',
                arrayEvent: {
                    item: epic,
                    index: i,
                    count: 1,
                    multiplier: -1,
                    type: 'delete'
                }
            })

        } else if(epic.feature === this){
            epic?.setFeature(undefined);
        }
    }

    create(epic: CreateEpicParameters, manager: Manager){
        return createEpic({...epic, ...{creatorId: manager.id, featureId: this.id}}).then(epics => {
            epics.data.forEach((ep: any)=>{
                this.addEpic(ep);
            })
            return epics;
        })
    }

    delete(epic: Epic){
        return deleteEpic({epicId: epic.id.toString()}).then((response)=> {
            console.log('response-project:', response);
            if(response  && (response.data === true || response.data.data === true)){
                // Deletion success.
                this.removeEpic(epic);
            }
            
        })
    }
}





export type ProjectProps = {
    id: number
    managerId: number
    clientId: number|undefined;
    name: string|undefined;
    description?: string|undefined
    createDate?: Date;
    features?: Array<Feature>|undefined;

    manager?: Manager;
    client?: Client;
}

export class Project implements BarryObject {
    id: number
    private _managerId: number
    private _clientId: number|undefined;
    name: string|undefined
    description: string|undefined
    createDate: Date|undefined
    features: Array<Feature> = [];

    manager: Manager|undefined;
    client: Client|undefined;

    publisher: BarryEventPublisher;
  
    constructor(props: ProjectProps) {
        this.id = props.id;
        this.name = props.name;
        this.createDate = props.createDate && typeof props.createDate === 'string' ? (new Date(props.createDate!)) : props.createDate;
        this.description = props.description;
        this.publisher = new BarryEventPublisher();

        const mngr: any|undefined = props.manager ? BarryObjectStore.Instance.decode(Manager, props.manager!) : undefined;
        this.manager = mngr;
        this._managerId = this.manager?.id || props.managerId;

        const clnt: any|undefined = props.client ? BarryObjectStore.Instance.decode(Client, props.client!) : undefined;
        this.client = clnt;
        this._clientId = this.client?.id || props.clientId;

        this.features = BarryObjectStore.Instance.decodeArray(Feature, props.features) as any;
    }

    get getObjectType(): string|undefined {
        return 'project';
    }

    merge(props: any): void {
        // Merge new object here.
    }

    get managerId(): number|undefined {
        return this._managerId ?? this.manager?.id;
    }

    setManager(manager: Manager){
        this.manager = manager;
        this._managerId = manager.id;
    }

    get clientId(): number|undefined {
        return this._clientId ?? this.client?.id;
    }

    public addFeature(feature: Feature): void {
        if(feature.project !== this){
            // Feature already belongs to another project, remove it from other project.
            feature?.project?.removeFeature(feature);
        }

        feature.setProject(this);
        this.features.push(feature);
        
        this.publisher.fire('valueChange', this, {
            oldValue: undefined,
            newValue: this.features,
            name: 'features',
            arrayEvent: {
                item: feature,
                index: this.features.length,
                count: 1,
                multiplier: 1,
                type: 'insert'
            }
        })
    }

    public removeFeature(feature: Feature): void {
        if(!feature) return;

        const i = this.features.indexOf(feature);
        if(i >= 0 && i <= this.features.length){
            this.features.splice(i, 1);
            feature?.setProject(undefined);

            this.publisher.fire('valueChange', this, {
                oldValue: undefined,
                newValue: this.features,
                name: 'features',
                arrayEvent: {
                    item: feature,
                    index: i,
                    count: 1,
                    multiplier: -1,
                    type: 'delete'
                }
            })

        } else if(feature.project === this){
            feature?.setProject(undefined);
        }
    }

    create(feature: CreateFeatureParameters, manager: Manager){
        return createFeature({...feature, ...{creatorId: manager.id, projectId: this.id}}).then(features => {
            features.data.forEach((fr: any)=>{
                this.addFeature(fr);
            })
            return features;
        })
    }

    delete(feature: Feature){
        return deleteFeature({featureId: feature.id.toString()}).then((response)=> {
            console.log('response-project:', response);
            if(response  && (response.data === true || response.data.data === true)){
                // Deletion success.
                this.removeFeature(feature);
            }
            
        })
    }

    toFormdata(): FormData {
        let formData = new FormData();
        
        if(this.managerId)
            formData.append("managerId", this.managerId.toString());

        if(this.clientId)
            formData.append("clientId", this.clientId.toString());
        
        formData.append("name", this.name || '');
        if(this.createDate && this.createDate != null)
            formData.append("startDate", this.createDate!.toString());
        if(this.clientId && this.clientId != null)
            formData.append("clientId", this.clientId!.toString());

        return formData;
    }
};