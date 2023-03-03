import React, { createContext, FC, PropsWithChildren, useEffect, useState } from "react";
import { BarryObjectStore, Client, ClientProps, Employee, EmployeeProps, Manager, ManagerProps, User, UserProps } from "./models/_types";
import {shallowEqual, useSelector, connect, useDispatch, ConnectedProps} from 'react-redux'
import {RootState} from '../setup'
import * as auth from '../app/modules/auth/redux/AuthRedux'

export interface BarryContextProps {
    currentUser: User|undefined
}

const BarryContextPropsDefaultProps: BarryContextProps = {
    currentUser: undefined
}

export const BarryContext = createContext<BarryContextProps>(BarryContextPropsDefaultProps);

export const useBarry = () => {
    return React.useContext(BarryContext);
}



const mapState = (state: RootState) => ({auth: state.auth})
const connector = connect(mapState, auth.actions)
type PropsFromRedux = ConnectedProps<typeof connector>

const BarryProvider: FC<PropsFromRedux> = (props) => {
    const user = useSelector<RootState>(({auth}) => auth.user, shallowEqual)
    const [currentUser, setCurrentUser] = useState<User|undefined>(undefined);

    useEffect(()=> {
        if(!currentUser){
            const newUser = userModelToUser(user);
            setCurrentUser(newUser);
            console.log('BARRY::PROVIDER:user:1:', newUser, 'user:', user);
        } else {
            const newUser = userModelToUser(user);
            if(newUser !== currentUser){
                setCurrentUser(newUser);
                console.log('BARRY::PROVIDER:user:2:', newUser, 'current:', currentUser, 'user:', user);
            } else {
                console.log('BARRY::PROVIDER:reuse:', newUser, 'current:', currentUser, 'user:', user);
            }
        }
    }, [user])

    function userModelToUser(user: unknown): User|undefined {
        if(!user || user === undefined || user === null || typeof user === 'undefined')
            return undefined;

        const dataType = (user as any).dataType;
        if(dataType && typeof dataType === 'string'){
            switch (dataType.toLowerCase()) {
                case "employee":
                    return BarryObjectStore.Instance.decode(Employee, user as EmployeeProps) as any
                case "manager":
                    return BarryObjectStore.Instance.decode(Manager, user as ManagerProps) as any
                case "client":
                    return BarryObjectStore.Instance.decode(Client, user as ClientProps) as any
                default:
                    break;
            }
        }
        const us: any = BarryObjectStore.Instance.decode(Employee, user as UserProps);
        return us as User;
    }

    return (
        <BarryContext.Provider value={{currentUser}}>
            {props.children}
        </BarryContext.Provider>
    );
}

export default connector(BarryProvider);