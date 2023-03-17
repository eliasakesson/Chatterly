import './Titlebar.scss'
import { ipcRenderer } from 'electron';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

const Titlebar = () => {
  return (
    <div className='titlebar'>
        <TitlebarLeft />
        <div className='title'>
            <span>Chatterly</span>
        </div>
        <TitlebarRight />
    </div>
  )
}

const TitlebarLeft = () => {
    return (
        <div className='left'>
            <div className='logo'>
                <img src='logo.png' alt='logo' />
            </div>
            <div className='buttons'>
                <div className='group'>
                    <button className='button'>File</button>
                    <div className='dropdown'>
                        <button className='button' onClick={() => signOut(auth)}>Log out</button>
                        <button className='button' onClick={() => ipcRenderer.send("close")}>Exit App</button>
                    </div>
                </div>
                <div className='group'>
                    <button className='button'>Edit</button>
                    <div className='dropdown'>
                        <button className='button'>Settings</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const TitlebarRight = () => {
    return (
        <div className='rightbuttons'>
            <button className='button' onClick={() => ipcRenderer.send("minimize")}>
                <svg aria-hidden="true" role="img" width="12" height="12" viewBox="0 0 12 12">
                    <rect fill="currentColor" width="10" height="1" x="1" y="6"></rect>
                </svg>
            </button>
            <button className='button' onClick={() => ipcRenderer.send("maximize")}>
                <svg aria-hidden="true" role="img" width="12" height="12" viewBox="0 0 12 12">
                    <rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="currentColor"></rect>
                </svg>
            </button>
            <button className='button' onClick={() => ipcRenderer.send("close")}>
                <svg aria-hidden="true" role="img" width="12" height="12" viewBox="0 0 12 12">
                    <polygon fill="currentColor" fillRule="evenodd" points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"></polygon>
                </svg>
            </button>
        </div>
    )
}

export default Titlebar