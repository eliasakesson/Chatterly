import Modal from '@/components/Modal'
import { auth, db } from '@/firebase'
import { DashboardContext } from '@/screens/Dashboard'
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import './ServerDropdown.scss'

const ServerDropdown = ({ closeDropdown } : { closeDropdown : () => void}) => {
    return (
        <div className='dropdown-bg' onClick={() => closeDropdown()}>
            <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                <InviteFriendsModal />
                <span className='divider'></span>
                <button className='btn'>Server Settings</button>
                <CreateChannelModal closeDropdown={closeDropdown} />
                <span className='divider'></span>
                <LeaveServerModal closeDropdown={closeDropdown} />
            </div>
        </div>
    )
}

export default ServerDropdown

const InviteFriendsModal = () => {

    const { serverID } = useContext(DashboardContext)

    const [open, setOpen] = useState(false)

    return (
        <>
            <button className='btn accent' onClick={() => setOpen(true)}>Invite Friends</button>
            <Modal open={open} closeModal={() => setOpen(false)}>
                <h1>Invite Friends</h1>
                <div className="text-input">
                    <label htmlFor="invite-link">Invite Id</label>
                    <div className="row">
                        <input name='invite-link' type="text" value={serverID} readOnly />
                        <button className='btn accent' onClick={() => {navigator.clipboard.writeText(serverID)}}>Copy</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

const CreateChannelModal = ({ closeDropdown } : { closeDropdown : () => void }) => {

    const { serverID } = useContext(DashboardContext)

    const [open, setOpen] = useState(false)
    const [channelName, setChannelName] = useState('')

    const createChannel = async () => {
        if (!channelName) {
            alert('Channel name cannot be empty')
            return
        }

        await addDoc(collection(db, "servers", serverID, "text-channels"), {
            name: channelName,
            timestamp: serverTimestamp()
        })
        setOpen(false)
        closeDropdown()
    }

    return (
        <>
            <button className='btn' onClick={() => setOpen(true)}>Create Channel</button>
            <Modal open={open} closeModal={() => setOpen(false)}>
                <h1>Create Channel</h1>
                <div className="text-input">
                    <label htmlFor="channel-name">Channel name</label>
                    <div className="row">
                        <input name='channel-name' type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} />
                        <button className='btn accent' onClick={() => createChannel()}>Create</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

const LeaveServerModal = ({ closeDropdown } : { closeDropdown : () => void }) => {

    const { serverID, setServerID } = useContext(DashboardContext)
    
    const [user] = useAuthState(auth)
    const [open, setOpen] = useState(false)

    const leaveServer = () => {
        setOpen(false)
        closeDropdown()
        setServerID('')

        if (user){
            deleteDoc(doc(db, 'users', user.uid, 'servers', serverID))
        }
    }

    return (
        <>
            <button className='btn red' onClick={() => setOpen(true)}>Leave Server</button>
            <Modal open={open} closeModal={() => setOpen(false)}>
                <h1>Are you sure?</h1>
                <div className="row">
                    <button className='btn' onClick={() => setOpen(false)}>Cancel</button>
                    <button className='btn red' onClick={() => leaveServer()}>Leave Server</button>
                </div>
            </Modal>
        </>
    )
}