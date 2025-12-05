import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [applications, setApplications] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/applications')
      const data = await res.json()
      setApplications(data)
    } catch (err) {
      setError('Failed to load applications')
    }
  }

  const handleStatusUpdate = async (appId, status) => {
    try {
      const res = await fetch(`http://localhost:8000/api/applications/${appId}?status=${status}`, {
        method: 'PUT'
      })

      if (res.ok) {
        fetchApplications()
      }
    } catch (err) {
      setError('Failed to update application')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Passport Administrator Dashboard</h2>
        
        {error && <p style={styles.error}>{error}</p>}
        
        {applications.length === 0 ? (
          <p style={styles.noData}>No applications yet</p>
        ) : (
          <div style={styles.applicationsList}>
            {applications.map((app, index) => (
              <div key={app.id} style={styles.applicationCard}>
                <h3>Applicant {index + 1}</h3>
                <div style={styles.details}>
                  <p><strong>Name:</strong> {app.name}</p>
                  <p><strong>Father Name:</strong> {app.father_name}</p>
                  <p><strong>Date of Birth:</strong> {app.date_of_birth}</p>
                  <p><strong>Email:</strong> {app.email}</p>
                  <p><strong>Phone:</strong> {app.phone}</p>
                  <p><strong>PAN:</strong> {app.pan}</p>
                  <p><strong>Permanent Address:</strong> {app.permanent_address}</p>
                  <p><strong>Temporary Address:</strong> {app.temporary_address}</p>
                  <p><strong>Status:</strong> <span style={getStatusStyle(app.status)}>{app.status}</span></p>
                </div>
                <div style={styles.actions}>
                  <button 
                    onClick={() => handleStatusUpdate(app.id, 'accepted')}
                    style={{...styles.button, backgroundColor: '#28a745'}}
                    disabled={app.status !== 'pending'}
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(app.id, 'rejected')}
                    style={{...styles.button, backgroundColor: '#dc3545'}}
                    disabled={app.status !== 'pending'}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const getStatusStyle = (status) => {
  const colors = {
    pending: '#ffc107',
    accepted: '#28a745',
    rejected: '#dc3545'
  }
  return { color: colors[status] || '#666', fontWeight: 'bold', textTransform: 'capitalize' }
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '40px' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: '1000px', margin: '0 auto' },
  error: { color: 'red', fontSize: '14px' },
  noData: { textAlign: 'center', color: '#666', padding: '40px' },
  applicationsList: { display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' },
  applicationCard: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f9f9f9' },
  details: { marginBottom: '15px' },
  actions: { display: 'flex', gap: '10px' },
  button: { padding: '10px 20px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }
}
