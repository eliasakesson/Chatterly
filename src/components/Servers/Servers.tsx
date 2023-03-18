import { useContext, useEffect, useState } from 'react'
import { db, auth } from '@/firebase'
import './Servers.scss'
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore'
import CreateJoinServerModal from './CreateJoinServerModal'
import { useAuthState } from 'react-firebase-hooks/auth'
import { DashboardContext } from '@/screens/Dashboard'

const Servers = () => {

    const { serverID, setServerID } = useContext(DashboardContext)

    const joinedServers = GetJoinedServers()

    useEffect(() => {
        if (joinedServers?.length > 0) {
            setServerID(joinedServers[0].id)
        }
        else {
            setServerID('')
        }
    }, [joinedServers])

    return (
        <ul className='servers'>
            {joinedServers.map((server : any) => {
                return <ServerSelecter key={server.id} name={server.name} photo={server.photoURL} selectServer={() => setServerID(server.id)} />
            })}
            <CreateServer selectServer={setServerID} />
        </ul>
    )
}

const GetJoinedServers = () => {
    const [user] = useAuthState(auth)
    const [joinedServers, setJoinedServers] = useState<any>([])

    const [userServerRefs, setUserServerRefs] = useState<any>([])

    useEffect(() => {
        if (user){
            const unsub = onSnapshot(collection(db, 'users', user.uid, "servers"), (snapshot) => {
                setUserServerRefs(snapshot.docs.map((doc) => doc))
            })

            return unsub
        }
    }, [user])

    useEffect(() => {
        if (userServerRefs){
            const data = Promise.all(userServerRefs.map(async (serverRef : any) => {
                const serverDoc = await getDoc(doc(db, "servers", serverRef.id));
                return serverDoc;
            }));
            
            data.then((data) => {
                setJoinedServers(data.map((doc) => ({...doc.data(), id: doc.id})))
            })
        }
    }, [userServerRefs])

    return joinedServers
}

interface ServerSelecterProps {
    name: string,
    photo: string,
    selectServer: any
}

const ServerSelecter = ({ name, photo, selectServer } : ServerSelecterProps) => {
    return (
        <li className='server' onClick={selectServer}>
            <div className='icon'>
                {photo ? <img src={photo} /> : <span>{name[0] + name[1]}</span>}
            </div>
            <div className='tooltip'>
                <span>{name}</span>
            </div>
        </li>
    )
}

const CreateServer = ({ selectServer } : any) => {

    const [modalOpen, setModalOpen] = useState(false)

    return (
        <li className='server accent' onClick={() => setModalOpen(true)}>
            <svg aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z"></path>
            </svg>
            <div className='tooltip'>
                <span>Create Server</span>
            </div>
            <CreateJoinServerModal open={modalOpen} closeModal={() => {setModalOpen(false)}} selectServer={selectServer} />
        </li>
    )
}

export default Servers