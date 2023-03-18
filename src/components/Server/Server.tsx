import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '@/firebase'
import { addDoc, collection, deleteDoc, doc, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth } from '@/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import './Server.scss'
import { useCollection, useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import ServerDropdown from './ServerDropdown'
import { DashboardContext } from '@/screens/Dashboard'
import Modal from '../Modal'

export const ServerContext = createContext({} as { channel : string, setChannel : (channel : string) => void })

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

    const [channels] = useCollection(
        query(
            collection(db, 'servers', serverID, 'text-channels'),
            orderBy('timestamp', 'desc')
        ),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    useEffect(() => {
        if (channels && channels.docs.length > 0 && !channel) setChannel(channels.docs[0].data().name)
    }, [channels])

    return (
        <ul className='channels'>
            {channels?.docs.map((channel, index) => (
                <Channel key={index} channel={channel.data().name} id={channel.id} />
            ))}
        </ul>
    )
}

const Channel = ({ channel, id } : any) => {

    const { channel: currentChannel, setChannel } = useContext(ServerContext)

    return (
        <li className={`channel ${channel === currentChannel ? "selected" : ""}`} onClick={() => setChannel(channel)}>
            <span className='name'>{channel}</span>
            <EditChannel channel={channel} id={id} />
        </li>
    )
}

const EditChannel = ({ channel, id } : any) => {

    const [editChannelOpen, setEditChannelOpen] = useState(false)

    const [channelName, setChannelName] = useState(channel)

    const { serverID } = useContext(DashboardContext)
    const { setChannel } = useContext(ServerContext)

    const saveChannel = async () => {
        if (channelName === channel) 
            return setEditChannelOpen(false)

        await setDoc(doc(db, "servers", serverID, "text-channels", id), {
            name: channelName
        }, { merge: true })
        setEditChannelOpen(false)
    }

    const deleteChannel = async () => {
        await deleteDoc(doc(db, "servers", serverID, "text-channels", id))
        setEditChannelOpen(false)
        if (channel === channelName) setChannel('')
    }

    return (
        <>
            <button className='edit' onClick={() => setEditChannelOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M481.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-30.9 28.1c-7.7 7.1-11.4 17.5-10.9 27.9c.1 2.9 .2 5.8 .2 8.8s-.1 5.9-.2 8.8c-.5 10.5 3.1 20.9 10.9 27.9l30.9 28.1c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-39.7-12.6c-10-3.2-20.8-1.1-29.7 4.6c-4.9 3.1-9.9 6.1-15.1 8.7c-9.3 4.8-16.5 13.2-18.8 23.4l-8.9 40.7c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-8.9-40.7c-2.2-10.2-9.5-18.6-18.8-23.4c-5.2-2.7-10.2-5.6-15.1-8.7c-8.8-5.7-19.7-7.8-29.7-4.6L69.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l30.9-28.1c7.7-7.1 11.4-17.5 10.9-27.9c-.1-2.9-.2-5.8-.2-8.8s.1-5.9 .2-8.8c.5-10.5-3.1-20.9-10.9-27.9L8.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l39.7 12.6c10 3.2 20.8 1.1 29.7-4.6c4.9-3.1 9.9-6.1 15.1-8.7c9.3-4.8 16.5-13.2 18.8-23.4l8.9-40.7c2-9.1 9-16.3 18.2-17.8C213.3 1.2 227.5 0 242 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l8.9 40.7c2.2 10.2 9.4 18.6 18.8 23.4c5.2 2.7 10.2 5.6 15.1 8.7c8.8 5.7 19.7 7.7 29.7 4.6l39.7-12.6c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM242 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
                </svg>
            </button>
            <Modal open={editChannelOpen} closeModal={() => setEditChannelOpen(false)}>
                <h1>Edit Channel</h1>
                <div className="text-input">
                    <label htmlFor="channel-name">Channel Name</label>
                    <input name='channel-name' type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} />
                </div>
                <div className="row">
                    <button className="btn danger" onClick={() => deleteChannel()}>Delete Channel</button>
                    <button className="btn accent" onClick={() => saveChannel()}>Save</button>
                </div>
            </Modal>
        </>
    )
}

const Messages = ({ channel } : { channel : string}) => {

    const { serverID } = useContext(DashboardContext)

    if (!serverID) return null
    if (!channel) return null

    const [messages] = useCollectionData(
        query(
            collection(db, 'servers', serverID, 'text-channels', channel, 'messages'),
            orderBy('timestamp', 'desc')
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

    if (!serverID) return null
    if (!channel) return null

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

        await addDoc(collection(db, 'servers', serverID, 'text-channels', channel, 'messages'), {
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