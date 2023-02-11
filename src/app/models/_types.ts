import { isArrayTypeNode } from "typescript";

export interface BarryObject {
    id: number;
    get getObjectType(): string|undefined;
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
            return new TCreator(props);
        }
        
        const objectType: string|undefined = TCreator.prototype.getObjectType;
        if(!objectType || objectType.length === 0){
            // There's no barry object type specified.
            return new TCreator(props);
        }

        const id: number = props.id;
        const stored: BarryObject|undefined = this.get(objectType, id);

        if(!stored){
            // There's no stored object.
            const decoded: T = new TCreator(props);
            const br: BarryObject = decoded as any;
            this.add(br);
            return decoded;
        } else {
            // There's a stored object, merge and returns the existing object.
            return (stored as any) as T;
        }
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
                this.data = new Array<T>();
                props.data!.map(function(value: any): T {
                    return BarryObjectStore.Instance.decode(TCreator, value) ?? (new TCreator(value));
                })
            } else {
                const decoded = BarryObjectStore.Instance.decode(TCreator, props.data);
                this.data = decoded !== undefined ? [decoded!] : [];
            }
        } else {
            const prs: any = props;
            if(Array.isArray(prs)){
                this.data = new Array<T>();
                prs.map(function(value: any): T {
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

    public constructor(props: UserProps){
        this.id = props.id;
        this.role = props.role ?? PersonRole.Employee;
        this.email = props.email;
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.name = props.name;
        this.pic = props.pic;

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
        super(props);
        this.projects = props.projects ?? (new Array<Project>());
    }

    override get getObjectType(): string|undefined {
        return 'employee';
    }
}



export interface ManagerProps extends EmployeeProps {
}

export class Manager extends Employee implements ManagerProps {

    public constructor(props: ManagerProps){
        super(props);
    }

    override get getObjectType(): string|undefined {
        return 'manager';
    }
}



export interface ClientProps extends UserProps {
    projects?: Array<Project>
}

export class Client extends User {
    projects: Array<Project>

    public constructor(props: ClientProps){
        super(props);
        this.projects = props.projects ?? (new Array<Project>());
    }

    override get getObjectType(): string|undefined {
        return 'client';
    }
}





export interface ProjectItemProps {
    id: number
    name?: string
    createDate: Date
    lastModified?: Date
    creator?: Person
}

export abstract class ProjectItem implements BarryObject {
    id: number
    name: string|undefined
    createDate: Date
    lastModified: Date|undefined
    creator: Person|undefined

    public constructor(props: ProjectItemProps){
        this.id = props.id;
        this.name = props.name;
        this.createDate = props.createDate;
        this.creator = props.creator;
    }

    abstract get getObjectType(): string|undefined;
}





export interface EpicProps extends ProjectItemProps {
    feature?: Feature
}

export class Epic extends ProjectItem {
    feature: Feature|undefined

    public constructor(props: EpicProps){
        super(props);
        this.feature = props.feature;
    }

    get getObjectType(): string|undefined {
        return 'epic';
    }
}





export interface FeatureProps extends ProjectItemProps {
    project?: Project
    epics?: Array<Epic>
}

export class Feature extends ProjectItem {
    project: Project|undefined
    epics: Array<Epic>
    
    public constructor(props: FeatureProps){
        super(props);
        this.project = props.project;
        this.epics = props.epics ?? (new Array<Epic>());
    }

    get getObjectType(): string|undefined {
        return 'feature';
    }
}





export type ProjectProps = {
    id: number
    managerId: number
    clientId: number|undefined;
    name: string|undefined;
    createDate?: Date;

    manager?: Manager;
    client?: Client;
}

export class Project implements BarryObject {
    id: number
    private _managerId: number
    private _clientId: number|undefined;
    name: string|undefined
    createDate: Date|undefined

    manager: Manager|undefined;
    client: Client|undefined;
  
    constructor(props: ProjectProps) {
      this.id = props.id;
      this.name = props.name;
      this.createDate = props.createDate;

      this.manager = props.manager ? new Manager(props.manager!) : undefined;
      this._managerId = this.manager?.id || props.managerId;

      this.client = props.client ? new Client(props.client!) : undefined;
      this._clientId = this.client?.id || props.clientId;
    }

    get getObjectType(): string|undefined {
        return 'project';
    }

    get managerId(): number|undefined {
        return this._managerId ?? this.manager?.id;
    }

    get clientId(): number|undefined {
        return this._clientId ?? this.client?.id;
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