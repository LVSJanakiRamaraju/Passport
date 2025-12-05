import { useState } from 'react'

export default function Application({ user }) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    name: '',
    father_name: '',
    date_of_birth: '',
    permanent_address: '',
    temporary_address: '',
    phone: '',
    email: '',
    pan: ''
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('http://localhost:8000/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      
      if (!res.ok) {
        setError(data.detail || 'Submission failed')
        return
      }

      setSuccess(true)
      setFormData({ 
        username: user?.username || '',
        name: '',
        father_name: '',
        date_of_birth: '',
        permanent_address: '',
        temporary_address: '',
        phone: '',
        email: '',
        pan: ''
      })
    } catch (err) {
      setError('Connection error. Make sure backend is running.')
    }
  }

  const handleCancel = () => {
    setFormData({ 
      username: user?.username || '',
      name: '',
      father_name: '',
      date_of_birth: '',
      permanent_address: '',
      temporary_address: '',
      phone: '',
      email: '',
      pan: ''
    })
    setError('')
    setSuccess(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>FORM 2: GIVE YOUR DETAILS</h2>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <label style={styles.label}>NAME</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>FATHER NAME</label>
            <input
              type="text"
              placeholder="Enter father's name"
              value={formData.father_name}
              onChange={(e) => setFormData({...formData, father_name: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>DATE OF BIRTH</label>
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>PERMANENT ADDRESS</label>
            <textarea
              placeholder="Enter permanent address"
              value={formData.permanent_address}
              onChange={(e) => setFormData({...formData, permanent_address: e.target.value})}
              style={{...styles.input, minHeight: '60px'}}
              required
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>TEMPORARY ADDRESS</label>
            <textarea
              placeholder="Enter temporary address"
              value={formData.temporary_address}
              onChange={(e) => setFormData({...formData, temporary_address: e.target.value})}
              style={{...styles.input, minHeight: '60px'}}
              required
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>PHONE NO</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>EMAIL ID</label>
            <input
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>PAN</label>
            <input
              type="text"
              placeholder="Enter PAN number"
              value={formData.pan}
              onChange={(e) => setFormData({...formData, pan: e.target.value.toUpperCase()})}
              style={styles.input}
              maxLength={10}
              required
            />
          </div>
          
          {success && <p style={styles.success}>Application submitted successfully!</p>}
          {error && <p style={styles.error}>{error}</p>}
          
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitButton}>SUBMIT</button>
            <button type="button" onClick={handleCancel} style={styles.cancelButton}>CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e8dcc4', padding: '20px' },
  card: { backgroundColor: '#f5f0e1', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', width: '600px', maxWidth: '100%' },
  header: { backgroundColor: '#0066cc', padding: '15px', marginBottom: '30px', borderRadius: '4px' },
  title: { color: 'white', margin: 0, fontSize: '20px', textAlign: 'center', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  formRow: { display: 'flex', alignItems: 'flex-start', gap: '15px' },
  label: { minWidth: '180px', fontSize: '14px', fontWeight: 'bold', paddingTop: '10px' },
  input: { flex: 1, padding: '10px', border: '1px solid #999', borderRadius: '4px', fontSize: '14px', backgroundColor: 'white' },
  buttonGroup: { display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' },
  submitButton: { padding: '12px 40px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  cancelButton: { padding: '12px 40px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  success: { color: 'green', fontSize: '14px', margin: 0, textAlign: 'center', fontWeight: 'bold' },
  error: { color: 'red', fontSize: '14px', margin: 0, textAlign: 'center', fontWeight: 'bold' }
}
