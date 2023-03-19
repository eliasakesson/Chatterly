import Popup from '@/components/Popup'
import { auth } from '@/firebase'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginSignup.scss'

const Login = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            navigate('/')
        }).catch((error) => {
            setErrorMessage(cleanErrorMessage(error.message))
        })
    }

    const handleGoogleLogin = () => {
        const provider = new GoogleAuthProvider()

        signInWithPopup(auth, provider).then((result) => {
            // Signed in
            navigate('/')
        }).catch((error) => {
            setErrorMessage(cleanErrorMessage(error.message))
        })
    }

    const cleanErrorMessage = (errorMessage : string) => {
        const regex = /(?<=Error \()(.*)(?=\))/;
        const match = errorMessage.match(regex);
        
        if (match) {
            const error = match[0];
            const cleanError = error.replace(/-/g, ' ');
            const message = cleanError.split('/')[1];
            if (message) {
                const capitalizedMessage = message.charAt(0).toUpperCase() + message.slice(1);
                return capitalizedMessage.replace(/-/g, ' ');
            }
        }

        return "Error";
    }

    return (
        <>
            <Popup message={errorMessage} setMessage={setErrorMessage} />
            <div className="login-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email-input">Email:</label>
                    <input type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="password-input">Password:</label>
                    <input type="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" className="submit-button">Login</button>
                </form>
                <div className="divider">
                    <hr />
                    <span>or</span>
                    <hr />
                </div>
                <button className="google-button" onClick={handleGoogleLogin}>
                    <img src="https://th.bing.com/th/id/R.0fa3fe04edf6c0202970f2088edea9e7?rik=joOK76LOMJlBPw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fgoogle-logo-png-open-2000.png&ehk=0PJJlqaIxYmJ9eOIp9mYVPA4KwkGo5Zob552JPltDMw%3d&risl=&pid=ImgRaw&r=0" alt="Google Logo" />
                    Login with Google
                </button>
                <p className='navigate-btn'>Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
        </>
    )
}

export default Login