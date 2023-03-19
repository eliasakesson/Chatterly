import './Popup.scss'
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

const Popup = ({ message, setMessage } : { message : string, setMessage : (message : string) => void }) => {

    const timeoutRef = useRef<any>()

    useEffect(() => {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            setMessage('')
        }, 2000)
    }, [message])

    if (!message) return null

    const popup = (
        <div className="popup-bg">
            <div className="popup">
                <h2>Error</h2>
                <p>{message}</p>
            </div>
        </div>
    )

    return createPortal(popup, document.getElementById('modal-root')!)
}

export default Popup