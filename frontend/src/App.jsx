import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import SignIn from './pages/SignIn'
import Application from './pages/Application'
import AdminDashboard from './pages/AdminDashboard'
import TestResults from './pages/TestResults'

function App() {
  const [user, setUser] = useState(null)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/signin" element={<SignIn setUser={setUser} />} />
        <Route path="/tests" element={<TestResults />} />
        <Route 
          path="/application" 
          element={user?.category === 'Applicant' ? <Application user={user} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin" 
          element={user?.category === 'Passport Administrator' ? <AdminDashboard /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
