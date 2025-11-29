import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const API_URL = 'http://localhost:3000/api';

function Dashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', department: '', date: '', message: '', doctorId: ''
  });
  const [response, setResponse] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(({ data }) => {
      setUserName(data.user.name);
      setUserEmail(data.user.email);
      setFormData(prev => ({ ...prev, name: data.user.name, email: data.user.email }));
    })
    .catch(() => {
      localStorage.clear();
      navigate('/login');
    });

    loadPrescriptions();
    loadDoctors();
  }, [navigate]);

  const loadPrescriptions = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(`${API_URL}/prescriptions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrescriptions(data);
    } catch (err) {
      console.error('Error loading prescriptions:', err);
    }
  };

  const loadDoctors = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/doctors`);
      setDoctors(data);
    } catch (err) {
      console.error('Error loading doctors:', err);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${API_URL}/appointments`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResponse('Appointment booked successfully!');
      setFormData({ name: userName, email: userEmail, phone: '', department: '', date: '', message: '', doctorId: '' });
    } catch (err) {
      setResponse('Failed to book appointment. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <nav className="sidebar">
        <div className="logo">HealthCare<span>+</span></div>
        <ul className="nav-menu">
          <li className={activePage === 'dashboard' ? 'active' : ''}>
            <a onClick={() => setActivePage('dashboard')}>Dashboard</a>
          </li>
          <li className={activePage === 'profile' ? 'active' : ''}>
            <a onClick={() => setActivePage('profile')}>My Profile</a>
          </li>
          <li className={activePage === 'prescriptions' ? 'active' : ''}>
            <a onClick={() => setActivePage('prescriptions')}>My Prescriptions</a>
          </li>
          <li className={activePage === 'appointments' ? 'active' : ''}>
            <a onClick={() => setActivePage('appointments')}>Book Appointment</a>
          </li>
          <li className={activePage === 'wellness' ? 'active' : ''}>
            <a onClick={() => setActivePage('wellness')}>Wellness Goals</a>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <div className="top-bar">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="page-content">
          {activePage === 'dashboard' && (
            <div>
              <div className="welcome">
                <h1>Welcome back, {userName}!</h1>
                <p>Here's your health overview for today</p>
              </div>

              <div className="health-tip">
                <span className="tip-icon">💡</span>
                <div>
                  <strong>Health Tip of the Day:</strong>
                  <p>Drink at least 8 glasses of water daily to stay hydrated.</p>
                </div>
              </div>

              <div className="stats-grid">
                {[
                  { icon: '👟', title: 'Steps', value: '7,842', goal: '10,000', width: '78%' },
                  { icon: '⏱️', title: 'Active Time', value: '45 min', goal: '60 min', width: '75%' },
                  { icon: '💧', title: 'Water Intake', value: '6 glasses', goal: '8 glasses', width: '75%' },
                  { icon: '😴', title: 'Sleep', value: '7.5 hrs', goal: '8 hrs', width: '94%' }
                ].map((stat, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-info">
                      <h3>{stat.title}</h3>
                      <p className="stat-value">{stat.value}</p>
                      <span className="stat-goal">Goal: {stat.goal}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: stat.width }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="reminders">
                <h2>Preventive Care Reminders</h2>
                <div className="reminder-list">
                  {[
                    { icon: '💉', title: 'Annual Flu Shot', due: '15 days' },
                    { icon: '🦷', title: 'Dental Checkup', due: '30 days' },
                    { icon: '👁️', title: 'Eye Examination', due: '45 days' }
                  ].map((reminder, i) => (
                    <div key={i} className="reminder-item">
                      <span className="reminder-icon">{reminder.icon}</span>
                      <div>
                        <h4>{reminder.title}</h4>
                        <p>Due in {reminder.due}</p>
                      </div>
                      <button className="btn-small">Schedule</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePage === 'profile' && (
            <div>
              <h1>My Profile</h1>
              <div className="profile-card">
                <div className="profile-header">
                  <div className="avatar">👤</div>
                  <div>
                    <h2>{userName}</h2>
                    <p>{userEmail}</p>
                  </div>
                </div>
                <div className="profile-info">
                  {[
                    ['Age', '32 years'],
                    ['Blood Type', 'O+'],
                    ['Height', '5\'8"'],
                    ['Weight', '165 lbs']
                  ].map(([label, value], i) => (
                    <div key={i} className="info-row">
                      <span>{label}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePage === 'prescriptions' && (
            <div>
              <div className="welcome">
                <h1>My Prescriptions</h1>
                <p>View all your prescribed medications</p>
              </div>

              <div className="prescriptions-list">
                {prescriptions.length === 0 ? (
                  <div className="prescription-card">
                    <p>No prescriptions yet.</p>
                  </div>
                ) : (
                  prescriptions.map((prescription) => (
                    <div key={prescription._id} className="prescription-card">
                      <div className="prescription-header">
                        <div>
                          <h3>Prescribed by: {prescription.doctorId?.name}</h3>
                          <p style={{color: '#666', fontSize: '0.9rem'}}>{prescription.doctorId?.email}</p>
                        </div>
                        <span className="date">{new Date(prescription.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                      <div className="medicines">
                        <strong>Medicines:</strong>
                        {prescription.medicines.map((med, i) => (
                          <div key={i} className="medicine-item">
                            • {med.name} - {med.tablets} tablets - {med.frequencyPerDay}x per day - {med.durationDays} days
                          </div>
                        ))}
                      </div>
                      {prescription.notes && <p><strong>Notes:</strong> {prescription.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activePage === 'appointments' && (
            <div>
              <div className="welcome">
                <h1>Book an Appointment</h1>
                <p>Schedule a consultation with our doctors</p>
              </div>

              <div className="appointment-form-container">
                <form onSubmit={handleAppointmentSubmit} className="appointment-form">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Select Doctor</label>
                    <select 
                      value={formData.doctorId}
                      onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                      required
                    >
                      <option value="">Choose a doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Department</label>
                    <select 
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="general">General Medicine</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="orthopedics">Orthopedics</option>
                      <option value="pediatrics">Pediatrics</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Appointment Date</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Reason for Visit</label>
                    <textarea 
                      rows="3"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="btn-primary">Book Appointment</button>
                </form>
                {response && <div className={`response ${response.includes('success') ? 'success' : 'error'}`}>{response}</div>}
              </div>
            </div>
          )}

          {activePage === 'wellness' && (
            <div>
              <h1>Wellness Goals</h1>
              <div className="goals-grid">
                {[
                  { icon: '🏃', title: 'Daily Steps', target: '10,000 steps', current: '7,842 steps', width: '78%' },
                  { icon: '💪', title: 'Exercise', target: '60 min/day', current: '45 min', width: '75%' },
                  { icon: '⚖️', title: 'Weight Goal', target: '160 lbs', current: '165 lbs', width: '85%' }
                ].map((goal, i) => (
                  <div key={i} className="goal-card">
                    <h3>{goal.icon} {goal.title}</h3>
                    <p className="goal-target">Target: {goal.target}</p>
                    <p className="goal-current">Current: {goal.current}</p>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: goal.width }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
