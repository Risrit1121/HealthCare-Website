import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const API_URL = 'http://localhost:3000/api';

function Home() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', department: '', date: '', message: '', doctorId: ''
  });
  const [response, setResponse] = useState('');
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/doctors`);
      setDoctors(data);
    } catch (err) {
      console.error('Error loading doctors:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${API_URL}/appointments`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResponse('Appointment booked successfully!');
      setFormData({ name: '', email: '', phone: '', department: '', date: '', message: '', doctorId: '' });
    } catch (err) {
      setResponse('Failed to book appointment. Please try again.');
    }
  };

  const goToDashboard = () => {
    const role = localStorage.getItem('userRole');
    if (role === 'provider') {
      navigate('/doctor-dashboard');
    } else if (role === 'patient') {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-page">
      <nav>
        <div className="container">
          <h1>HealthCare+</h1>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#appointments">Book Appointment</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a onClick={goToDashboard} style={{cursor: 'pointer'}}>Dashboard</a></li>
          </ul>
        </div>
      </nav>

      <section id="home" className="hero">
        <div className="container">
          <h2>Quality Healthcare at Your Fingertips</h2>
          <p>Book appointments, consult doctors, and manage your health records online</p>
          <button onClick={() => document.getElementById('appointments').scrollIntoView({ behavior: 'smooth' })}>
            Book Appointment
          </button>
        </div>
      </section>

      <section id="services" className="services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="service-grid">
            {[
              { title: 'General Consultation', desc: 'Expert medical advice for common health concerns' },
              { title: 'Specialist Care', desc: 'Access to specialized doctors across multiple fields' },
              { title: 'Lab Tests', desc: 'Comprehensive diagnostic and laboratory services' },
              { title: 'Emergency Care', desc: '24/7 emergency medical assistance' }
            ].map((service, i) => (
              <div key={i} className="service-card">
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="appointments" className="appointments">
        <div className="container">
          <h2>Book an Appointment</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Full Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required 
            />
            <select 
              value={formData.doctorId}
              onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
              ))}
            </select>
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
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required 
            />
            <textarea 
              placeholder="Reason for visit" 
              rows="3"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
            <button type="submit">Book Appointment</button>
          </form>
          {response && <div className={`response ${response.includes('success') ? 'success' : 'error'}`}>{response}</div>}
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="container">
          <h2>Contact Us</h2>
          <p>📞 Emergency: 911 | 📧 info@healthcare.com</p>
          <p>📍 123 Medical Center Drive, City, State 12345</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
