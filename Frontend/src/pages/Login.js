import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_URL = 'http://localhost:3000/api';

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState('patient');
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/doctors`)
      .then(({ data }) => setDoctors(data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
    const payload = isLoginMode 
      ? { email: formData.email, password: formData.password, role: selectedRole }
      : { ...formData, role: selectedRole };

    try {
      const { data } = await axios.post(`${API_URL}${endpoint}`, payload);
      
      if (!isLoginMode) {
        // After registration, redirect to login
        setIsLoginMode(true);
        setFormData({ email: formData.email, password: '', name: '' });
        setError('Registration successful! Please login.');
        return;
      }
      
      // Login successful
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userRole', data.user.role);
      
      navigate(data.user.role === 'patient' ? '/dashboard' : '/doctor-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="login-page">
      <div className="health-alert">
        <span className="alert-icon">⚠️</span>
        <div>
          <strong>Health Alert:</strong> Flu season is here. Get vaccinated. COVID-19 boosters available. Stay safe and healthy!
        </div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="logo">
            <h1>HealthCare<span>+</span></h1>
            <p>Your Health, Our Priority</p>
          </div>

          <div className="role-selector">
            <button 
              className={`role-btn ${selectedRole === 'patient' ? 'active' : ''}`}
              onClick={() => setSelectedRole('patient')}
            >
              <span className="icon">👤</span>
              <span>Patient</span>
            </button>
            <button 
              className={`role-btn ${selectedRole === 'provider' ? 'active' : ''}`}
              onClick={() => setSelectedRole('provider')}
            >
              <span className="icon">⚕️</span>
              <span>Healthcare Provider</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLoginMode && selectedRole === 'patient' && (
              <div className="input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required={!isLoginMode}
                />
              </div>
            )}
            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="login-btn">
              {isLoginMode ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {error && <div className={`error-msg ${error.includes('successful') ? 'success-msg' : ''}`}>{error}</div>}
          
          {selectedRole === 'patient' && (
            <div className="links">
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginMode(!isLoginMode); setError(''); }}>
                {isLoginMode ? 'Create Account' : 'Already have an account? Sign In'}
              </a>
            </div>
          )}
        </div>

        <div className="info-panel">
          <h2>Welcome Back!</h2>
          <div className="info-cards">
            <div className="info-card">
              <span className="info-icon">📊</span>
              <h3>Track Your Health</h3>
              <p>Monitor wellness goals, daily activities, and health metrics in real-time</p>
            </div>
            <div className="info-card">
              <span className="info-icon">📅</span>
              <h3>Easy Appointments</h3>
              <p>Book and manage appointments with our expert doctors online</p>
            </div>
            <div className="info-card">
              <span className="info-icon">💊</span>
              <h3>Expert Care</h3>
              <p>Get timely health reminders and consultations from {doctors.length} specialist doctors</p>
            </div>
            {doctors.length > 0 && (
              <div className="info-card">
                <span className="info-icon">👨‍⚕️</span>
                <h3>Our Doctors</h3>
                <p style={{ fontSize: '0.9rem' }}>
                  {doctors.map(d => d.name.replace('Dr ', '')).join(' • ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
