import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignIn({ setUser }) {
  const [formData, setFormData] = useState({ 
    username: '',
    email: '', 
    password: '', 
    category: 'Applicant' 
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      
      if (!res.ok) {
        setError(data.detail || 'Sign up failed')
        return
      }

      setSuccess(true)
      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      setError('Connection error. Make sure backend is running.')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={styles.input}
            required
          />
          
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="Applicant"
                checked={formData.category === 'Applicant'}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
              Applicant
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="Passport Administrator"
                checked={formData.category === 'Passport Administrator'}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
              Passport Administrator
            </label>
          </div>

          {success && <p style={styles.success}>Account created! Redirecting to login...</p>}
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        <p style={styles.link}>
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '400px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  button: { padding: '12px', backgroundColor: '#1877f2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  success: { color: 'green', fontSize: '14px', margin: 0 },
  error: { color: 'red', fontSize: '14px', margin: 0 },
  link: { marginTop: '20px', textAlign: 'center', fontSize: '14px' },
  radioGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }
}
