import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const API_URL = 'http://localhost:3000/api';

function DoctorDashboard() {
  const [activePage, setActivePage] = useState('patients');
  const [userName, setUserName] = useState('');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    notes: '',
    medicines: [{ name: '', tablets: '', frequencyPerDay: '', durationDays: '' }]
  });
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
      if (data.user.role !== 'provider') {
        navigate('/dashboard');
      }
    })
    .catch(() => {
      localStorage.clear();
      navigate('/login');
    });

    loadPatients();
    loadPrescriptions();
    loadAppointments();
  }, [navigate]);

  const loadAppointments = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(data);
    } catch (err) {
      console.error('Error loading appointments:', err);
    }
  };

  const loadPatients = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(`${API_URL}/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(data);
    } catch (err) {
      console.error('Error loading patients:', err);
    }
  };

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

  const handlePrescribe = (patientId) => {
    setSelectedPatient(patientId);
    setShowPrescriptionForm(true);
  };

  const addMedicine = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [...prescriptionData.medicines, { name: '', tablets: '', frequencyPerDay: '', durationDays: '' }]
    });
  };

  const updateMedicine = (index, field, value) => {
    const newMedicines = [...prescriptionData.medicines];
    newMedicines[index][field] = value;
    setPrescriptionData({ ...prescriptionData, medicines: newMedicines });
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/prescriptions`, {
        patientId: selectedPatient,
        ...prescriptionData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowPrescriptionForm(false);
      setPrescriptionData({
        diagnosis: '',
        notes: '',
        medicines: [{ name: '', tablets: '', frequencyPerDay: '', durationDays: '' }]
      });
      loadPrescriptions();
      alert('Prescription created successfully!');
    } catch (err) {
      alert('Error creating prescription');
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
          <li className={activePage === 'patients' ? 'active' : ''}>
            <a onClick={() => setActivePage('patients')}>Patients</a>
          </li>
          <li className={activePage === 'appointments' ? 'active' : ''}>
            <a onClick={() => setActivePage('appointments')}>Appointments</a>
          </li>
          <li className={activePage === 'prescriptions' ? 'active' : ''}>
            <a onClick={() => setActivePage('prescriptions')}>Prescriptions</a>
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
          {activePage === 'patients' && (
            <div>
              <div className="welcome">
                <h1>Welcome, {userName}</h1>
                <p>Patient Management Dashboard</p>
              </div>

              <div className="patients-table">
                <h2>Patient List ({patients.length})</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Age</th>
                      <th>Blood Type</th>
                      <th>Condition</th>
                      <th>Registered</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient._id}>
                        <td>{patient.name}</td>
                        <td>{patient.email}</td>
                        <td>{patient.age || 'N/A'}</td>
                        <td><span className="blood-type">{patient.bloodType || 'N/A'}</span></td>
                        <td><span className={`disease ${patient.disease === 'None' ? 'healthy' : ''}`}>
                          {patient.disease || 'N/A'}
                        </span></td>
                        <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button className="btn-small" onClick={() => handlePrescribe(patient._id)}>
                            Prescribe
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showPrescriptionForm && (
                <div className="modal">
                  <div className="modal-content">
                    <h2>Create Prescription</h2>
                    <form onSubmit={submitPrescription}>
                      <div className="input-group">
                        <label>Diagnosis</label>
                        <input 
                          type="text" 
                          value={prescriptionData.diagnosis}
                          onChange={(e) => setPrescriptionData({...prescriptionData, diagnosis: e.target.value})}
                          required
                        />
                      </div>

                      <h3>Medicines</h3>
                      {prescriptionData.medicines.map((med, index) => (
                        <div key={index} className="medicine-row">
                          <input 
                            placeholder="Medicine Name"
                            value={med.name}
                            onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                            required
                          />
                          <input 
                            type="number"
                            placeholder="No. of Tablets"
                            value={med.tablets}
                            onChange={(e) => updateMedicine(index, 'tablets', e.target.value)}
                            required
                          />
                          <input 
                            type="number"
                            placeholder="Times per Day"
                            value={med.frequencyPerDay}
                            onChange={(e) => updateMedicine(index, 'frequencyPerDay', e.target.value)}
                            required
                          />
                          <input 
                            type="number"
                            placeholder="Days"
                            value={med.durationDays}
                            onChange={(e) => updateMedicine(index, 'durationDays', e.target.value)}
                            required
                          />
                        </div>
                      ))}
                      <button type="button" onClick={addMedicine} className="btn-add">+ Add Medicine</button>

                      <div className="input-group">
                        <label>Notes</label>
                        <textarea 
                          value={prescriptionData.notes}
                          onChange={(e) => setPrescriptionData({...prescriptionData, notes: e.target.value})}
                          rows="3"
                        />
                      </div>

                      <div className="modal-actions">
                        <button type="submit" className="btn-primary">Create Prescription</button>
                        <button type="button" onClick={() => setShowPrescriptionForm(false)} className="btn-secondary">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activePage === 'appointments' && (
            <div>
              <div className="welcome">
                <h1>My Appointments</h1>
                <p>Scheduled patient appointments</p>
              </div>

              <div className="patients-table">
                <h2>Appointments ({appointments.length})</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Department</th>
                      <th>Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td>{appointment.name}</td>
                        <td>{appointment.email}</td>
                        <td>{appointment.phone}</td>
                        <td>{appointment.department}</td>
                        <td>{new Date(appointment.date).toLocaleDateString()}</td>
                        <td>{appointment.message || 'N/A'}</td>
                        <td><span className="blood-type">{appointment.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activePage === 'prescriptions' && (
            <div>
              <div className="welcome">
                <h1>Prescriptions</h1>
                <p>All prescribed medications</p>
              </div>

              <div className="prescriptions-list">
                {prescriptions.map((prescription) => (
                  <div key={prescription._id} className="prescription-card">
                    <div className="prescription-header">
                      <h3>{prescription.patientId?.name}</h3>
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
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DoctorDashboard;
