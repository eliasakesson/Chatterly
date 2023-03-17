import { createPortal } from 'react-dom';
import './Modal.scss'

const Modal = ({ children, open, closeModal } : any) => {

    const modal = (
        <div className="modal-background" onClick={(e) => {e.stopPropagation(); closeModal()}}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className='close-btn' onClick={() => closeModal()}>
                    <svg aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 12 12">
                        <polygon fill="currentColor" fillRule="evenodd" points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"></polygon>
                    </svg>
                </button>
                {children}
            </div>
        </div>
    )

    if (!open) return null

    return createPortal(modal, document.getElementById('modal-root')!)
}

export default Modal