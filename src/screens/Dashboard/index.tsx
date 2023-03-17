import './Dashboard.scss'

import Servers from "@/components/Servers"
import Titlebar from "@/components/Titlebar"
import Server, { ServerProps } from '@/components/Server'
import { createContext, useEffect, useState } from 'react'

export const DashboardContext = createContext<any>({})

const Dashboard = () => {

    const [serverID, setServerID] = useState<string>('')

    return (
        <DashboardContext.Provider value={{serverID, setServerID}}>
            <div className='dashboard'>
                <Servers />
                <Server />
            </div>
        </DashboardContext.Provider>
    )
}

export default Dashboard