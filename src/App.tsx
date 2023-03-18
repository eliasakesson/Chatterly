import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import Dashboard from './screens/Dashboard'
import Login from './screens/LoginSignup/Login'
import Signup from './screens/LoginSignup/Signup'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase'
import Titlebar from './components/Titlebar'

function App() {

  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login')
    }

  }, [user, loading])

  return (
    <>
      <Titlebar />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='*' element={
        <div style={{display: "flex", justifyContent: "center", height: "100%", alignItems: "center", flexDirection: "column", gap: "1rem"}}>
          <h1>404</h1>
          <Link to="/">Go back to home</Link>
        </div>} />
      </Routes>
      <div id='modal-root'></div>
    </>
  )
}

export default App
