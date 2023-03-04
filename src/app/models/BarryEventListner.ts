export type BarryEventCallback = (event: string, target: any, options: any)=>void;
export interface IBarryEventListner {

    receive?: ((event: string, target: any, options: any)=>number) | undefined;
}

export class BarryEventListner implements IBarryEventListner {

    private handlers: { [key: string]: Array<BarryEventCallback>} = {};

    constructor(){
        this.handlers = {};
    }

    public receive(event: string, target: any, options: any): number {
        // Handle event received.
        var numberOfFiredHandlers: number = 0;
        Object.keys(this.handlers).map(action => {
            if(action === event && this.handlers && this.handlers[action] && Array.isArray(this.handlers[action])){
                if(Array.isArray(this.handlers[action])){
                    this.handlers[action].forEach((handler) => handler(event, target, options));
                    numberOfFiredHandlers++;
                } else if(typeof this.handlers[action] === 'function'){
                    (this.handlers[action] as any)(event, target, options);
                    numberOfFiredHandlers++;
                }
            }
        });
        return numberOfFiredHandlers;
    }

    public addHandler(event: string, handler: BarryEventCallback){
        if(!this.handlers)
            this.handlers = {};

        if(!this.handlers[event] || !Array.isArray(this.handlers))
            this.handlers[event] = [handler];
        else
            this.handlers[event].push(handler);
    }

    public setHandler(event: string, handler: BarryEventCallback){
        if(!this.handlers)
            this.handlers = {};

        this.handlers[event] = [handler];
    }

    public removeAllHandlers(event?: string|undefined): BarryEventListner {
        if(!event || event === undefined || event === null || typeof event === 'undefined'){
            this.handlers = {};
            return this;
        }

        if(this.handlers[event] && typeof this.handlers[event] !== 'undefined')
            delete this.handlers[event];

        return this;
    }

    public removeFromPublisher(publisher: BarryEventPublisher|undefined): BarryEventListner {
        if(!publisher || !(publisher instanceof BarryEventPublisher))
            return this;

        publisher.removeListner(this);
        return this;
    }

    public removeFromPublisherWithHandlers(publisher: BarryEventPublisher|undefined, event?:string|undefined, ref?: React.MutableRefObject<BarryEventListner|undefined>|undefined): BarryEventListner {
        if(!ref && ref === undefined && typeof ref === undefined && event && (event as any).current === this)
            return this.removeFromPublisherWithHandlers(publisher, undefined, event as any)

        return this.removeFromPublisher(publisher).removeAllHandlers(event).then((listner) => {
            ref && (ref.current = undefined);
            return listner;
        }) as BarryEventListner;
    }

    public then<T = BarryEventListner>(block: (listner: BarryEventListner)=>(T|undefined)): T|undefined {
        return block(this);
    }
}

export class BarryEventPublisher {

    listners: Array<BarryEventListner> = [];

    constructor(){
        this.listners = new Array<BarryEventListner>();
    }

    public fire(event: string, target: any, options?: any|undefined): number {
        var numberOfFiredHandlers: number = 0;
        this.listners && Array.isArray(this.listners) && this.listners.forEach(listner => {
            numberOfFiredHandlers += listner.receive(event, target, options);
        })
        return numberOfFiredHandlers;
    }

    public addListner(listner: BarryEventListner): BarryEventListner|undefined {
        const i = this.listners && Array.isArray(this.listners) ? this.listners.indexOf(listner) : -1;
        if(i >= 0 && i < this.listners.length)
            // Already added.
            return undefined;

        if(!this.listners || !Array.isArray(this.listners))
            this.listners = new Array();

        this.listners.push(listner);
        return listner;
    }

    public removeListner(listner: BarryEventListner): BarryEventListner|undefined {
        const i = this.listners && Array.isArray(this.listners) ? this.listners.indexOf(listner) : -1;
        if(i < 0 || i >= this.listners.length)
            // Isn't added yet.
            return undefined;

        this.listners.splice(i);
        return listner;
    }

    public makeListner(setup?: ((listner: BarryEventListner)=>void)|undefined): BarryEventListner {
        const listner = new BarryEventListner();
        if(!this.listners || !Array.isArray(this.listners))
            this.listners = new Array<BarryEventListner>();

        this.listners.push(listner);
        setup && typeof setup === 'function' && setup(listner);
        return listner;
    }

    public removeFromOwner(owner: any): BarryEventPublisher {
        if(!owner || owner === null || owner === undefined || typeof owner === 'undefined' || owner === this)
            return this;
        
        if(Array.isArray(owner)){
            const i = owner.indexOf(this);
            if(i >= 0 && i< owner.length)
                owner.splice(i);
        } else if(owner && owner.publisher && owner.publisher === this){
            owner.publisher = undefined;
        } else if(owner && owner.publishers && owner.publishers === this){
            owner.publishers = undefined;
        } else if(owner && owner.publisher && Array.isArray(owner.publisher)){
            return this.removeFromOwner(owner.publisher);
        } else if(owner && owner.publishers && Array.isArray(owner.publishers)){
            return this.removeFromOwner(owner.publishers);
        }

        return this;
    }

    public then<T = BarryEventPublisher>(block: (listner: BarryEventPublisher)=>(T|undefined)): T|undefined {
        return block(this);
    }
}