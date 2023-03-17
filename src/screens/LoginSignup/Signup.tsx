import { auth } from '@/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginSignup.scss'

const Signup = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            // Signed in 
            updateProfile(userCredential.user, {
                displayName: username
            }).then(() => {
                navigate('/')
            }).catch((error) => {
                alert(error.message)
            })            
        }).catch((error) => {
            alert(error.message)
        })
    }

    return (
        <div className="login-container">
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username-input">Username:</label>
                <input type="text" name="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="email-input">Email:</label>
                <input type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="password-input">Password:</label>
                <input type="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="submit-button">Sign up</button>
            </form>
            <div className="divider">
                <hr />
                <span>or</span>
                <hr />
            </div>
            <button className="google-button">
                <img src="https://th.bing.com/th/id/R.0fa3fe04edf6c0202970f2088edea9e7?rik=joOK76LOMJlBPw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fgoogle-logo-png-open-2000.png&ehk=0PJJlqaIxYmJ9eOIp9mYVPA4KwkGo5Zob552JPltDMw%3d&risl=&pid=ImgRaw&r=0" alt="Google Logo" />
                Sign up with Google
            </button>
            <p className='navigate-btn'>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    )
}

export default Signup