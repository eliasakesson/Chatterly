import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '@/firebase'
import { addDoc, collection, doc, limit, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { auth } from '@/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import './Server.scss'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import ServerDropdown from './ServerDropdown'
import { DashboardContext } from '@/screens/Dashboard'

const ServerContext = createContext({} as { channel : string, setChannel : (channel : string) => void })

const Server = () => {

    const { serverID } = useContext(DashboardContext)

    if (!serverID) return null

    const [channel, setChannel] = useState('')

    useEffect(() => {
        setChannel('')
    }, [serverID])

    const [server] = useDocumentData(
        doc(db, 'servers', serverID),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    return (
        <ServerContext.Provider value={{ channel, setChannel }}>
            <div className='server-screen'>
                <ServerLeft name={server?.name} />
                <div className="chat">
                    <Messages channel={channel} />
                    <MessageInput channel={channel} />
                </div>
            </div>
        </ServerContext.Provider>
    )
}

export interface ServerProps {
    name: string,
    photoURL?: string,
    id: string
}

const ServerLeft = ({ name } : any) => {

    const [serverDropdownOpen, setServerDropdownOpen] = useState(false)

    return (
        <div className='left'>
            <div className="title" onClick={() => setServerDropdownOpen(open => !open)}>
                <h1>{name}</h1>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="M169.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 274.7 54.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                </svg>
            </div>
            <Channels />
            {serverDropdownOpen ? <ServerDropdown closeDropdown={() => setServerDropdownOpen(false)} /> : null}
        </div>
    )
}

const Channels = () => {
    
    const { serverID } = useContext(DashboardContext)
    const { channel, setChannel } = useContext(ServerContext)

    if (!serverID) return null

    const [channels] = useCollectionData(
        query(
            collection(db, 'servers', serverID, 'channels'),
            orderBy('timestamp', 'desc'),
            // limit(25)
        ),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    useEffect(() => {
        if (channels && channels.length > 0 && !channel) setChannel(channels[0].name)
    }, [channels])

    return (
        <ul className='channels'>
            {channels?.map((channel, index) => (
                <Channel key={index} channel={channel.name} />
            ))}
        </ul>
    )
}

const Channel = ({ channel } : any) => {

    const { channel: currentChannel, setChannel } = useContext(ServerContext)

    return (
        <li className={`channel ${channel === currentChannel ? "selected" : ""}`} onClick={() => setChannel(channel)}>
            <span className='name'>{channel}</span>
        </li>
    )
}

const Messages = ({ channel } : { channel : string}) => {

    const { serverID } = useContext(DashboardContext)

    if (!serverID) return null
    if (!channel) return null

    const [messages] = useCollectionData(
        query(
            collection(db, 'servers', serverID, 'channels', channel, 'messages'),
            orderBy('timestamp', 'desc'),
            // limit(25)
        ),
        {
          snapshotListenOptions: { includeMetadataChanges: true },
        }
      );

    return (
        <ul className="messages">
            {messages?.map((message, index) => (
                <Message key={index} message={message} />
            ))}
        </ul>
    )
}

const Message = ({ message } : any) => {

    const { message: msg, timestamp, user } = message

    return (
        <li className="message">
            <div className="avatar">
                <img src="https://th.bing.com/th/id/OIP.65L6UrVpeMD0iVMoS_3rGwHaHa?pid=ImgDet&rs=1" alt="avatar" />
            </div>
            <div className="content">
                <div className="header">
                    <span className='name'>{user.name}</span>
                    <span className='time'>{timestamp ? GetTimeSince(timestamp.toDate()) : ""}</span>
                </div>
                <p className='text'>{msg}</p>
            </div>
        </li>
    )
}

const GetTimeSince = (date: Date) => {
    const diff = new Date().getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} days ago`
    if (hours > 0) return `${hours} hours ago`
    if (minutes > 0) return `${minutes} minutes ago`
    if (seconds > 0) return `${seconds} seconds ago`
    return 'Just now'
}

const MessageInput = ({ channel } : { channel : string}) => {

    const { serverID } = useContext(DashboardContext)

    const [user] = useAuthState(auth)
    const [message, setMessage] = useState('')

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && message) {
            sendMessage()
        }
    }

    const sendMessage = async () => {
        if (!user){
            alert('You need to be logged in to send messages')
            return
        }

        setMessage('')

        await addDoc(collection(db, 'servers', serverID, 'channels', channel, 'messages'), {
            message,
            timestamp: serverTimestamp(),
            user: {
                id: user.uid,
                name: user.displayName,
                avatar: user.photoURL
            }
        })
    }
    
    return (
        <div className="input">
            <input type="text" placeholder="Message #general" value={message} onKeyDown={handleKeyDown} onChange={(e) => setMessage(e.target.value)} />
        </div>
    )
}

export default Server