import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { getUser, logout } from '../utils/auth'

function DoctorDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientWellness, setPatientWellness] = useState(null)
  const [wellnessHistory, setWellnessHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingWellness, setLoadingWellness] = useState(false)

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser || currentUser.role !== 'healthcare_provider') {
      navigate('/login')
      return
    }
    setUser(currentUser)
    loadPatients()
  }, [navigate])

  const loadPatients = async () => {
    try {
      const response = await api.get('/users/patients')
      setPatients(response.data.patients)
    } catch (error) {
      console.error('Error loading patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPatientWellness = async (patientId) => {
    setLoadingWellness(true)
    try {
      const [latestResponse, historyResponse] = await Promise.all([
        api.get(`/wellness/patient/${patientId}/latest`),
        api.get(`/wellness/patient/${patientId}`)
      ])
      
      setPatientWellness(latestResponse.data.wellness)
      setWellnessHistory(historyResponse.data.wellnessData || [])
    } catch (error) {
      console.error('Error loading patient wellness:', error)
    } finally {
      setLoadingWellness(false)
    }
  }

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient)
    loadPatientWellness(patient.id)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">Healthcare Portal</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Dr. {user?.name}</span>
              {user?.specialization && (
                <span className="text-sm text-gray-500">({user.specialization})</span>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
          <p className="text-gray-600">View and monitor patient wellness progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patients List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">All Patients</h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {patients.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No patients found</p>
                ) : (
                  patients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => handlePatientClick(patient)}
                      className={`p-4 rounded-lg cursor-pointer transition ${
                        selectedPatient?.id === patient.id
                          ? 'bg-primary-100 border-2 border-primary-600'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                      {patient.phone && (
                        <p className="text-sm text-gray-500">{patient.phone}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Patient Details and Wellness */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <div className="space-y-6">
                {/* Patient Info */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{selectedPatient.email}</p>
                    </div>
                    {selectedPatient.phone && (
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">{selectedPatient.phone}</p>
                      </div>
                    )}
                    {selectedPatient.dateOfBirth && (
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium text-gray-900">
                          {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedPatient.address?.street && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">{selectedPatient.address.street}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Wellness Progress */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Wellness Progress</h2>
                  
                  {loadingWellness ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading wellness data...</p>
                    </div>
                  ) : patientWellness ? (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-primary-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Steps</p>
                          <p className="text-2xl font-bold text-primary-600">{patientWellness.steps || 0}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Heart Rate</p>
                          <p className="text-2xl font-bold text-red-600">{patientWellness.heartRate || 0} bpm</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Blood Pressure</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {patientWellness.bloodPressure?.systolic || 0}/{patientWellness.bloodPressure?.diastolic || 0}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Weight</p>
                          <p className="text-2xl font-bold text-green-600">{patientWellness.weight || 0} kg</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Height</p>
                          <p className="text-2xl font-bold text-purple-600">{patientWellness.height || 0} cm</p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Calories</p>
                          <p className="text-2xl font-bold text-yellow-600">{patientWellness.caloriesBurned || 0}</p>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Sleep</p>
                          <p className="text-2xl font-bold text-indigo-600">{patientWellness.sleepHours || 0} hrs</p>
                        </div>
                        {patientWellness.notes && (
                          <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                            <p className="text-sm text-gray-600">Notes</p>
                            <p className="text-sm text-gray-800">{patientWellness.notes}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          Last Updated: {new Date(patientWellness.date).toLocaleString()}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No wellness data available for this patient</p>
                  )}

                  {/* Wellness History */}
                  {wellnessHistory.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Wellness History</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {wellnessHistory.slice(0, 10).map((entry, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">
                              {new Date(entry.date).toLocaleDateString()}
                            </span>
                            <div className="flex space-x-4 text-sm">
                              <span className="font-medium">Steps: {entry.steps}</span>
                              <span className="font-medium">HR: {entry.heartRate} bpm</span>
                              <span className="font-medium">
                                BP: {entry.bloodPressure?.systolic || 0}/{entry.bloodPressure?.diastolic || 0}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500 text-lg">Select a patient to view their details and wellness progress</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard



