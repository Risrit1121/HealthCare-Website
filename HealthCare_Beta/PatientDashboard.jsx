import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { getUser, logout } from '../utils/auth'

function PatientDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [wellness, setWellness] = useState(null)
  const [wellnessHistory, setWellnessHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingWellness, setEditingWellness] = useState(false)
  const [profileData, setProfileData] = useState({})
  const [wellnessData, setWellnessData] = useState({})
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser || currentUser.role !== 'patient') {
      navigate('/login')
      return
    }
    setUser(currentUser)
    loadUserData()
    loadWellnessData()
  }, [navigate])

  const loadUserData = async () => {
    try {
      const response = await api.get('/users/profile')
      setUser(response.data.user)
      setProfileData({
        name: response.data.user.name || '',
        phone: response.data.user.phone || '',
        dateOfBirth: response.data.user.dateOfBirth ? response.data.user.dateOfBirth.split('T')[0] : '',
        address: response.data.user.address?.street || ''
      })
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const loadWellnessData = async () => {
    try {
      const [latestResponse, historyResponse] = await Promise.all([
        api.get('/wellness/my-wellness/latest'),
        api.get('/wellness/my-wellness')
      ])
      
      if (latestResponse.data.wellness) {
        setWellness(latestResponse.data.wellness)
        setWellnessData({
          steps: latestResponse.data.wellness.steps || 0,
          heartRate: latestResponse.data.wellness.heartRate || 0,
          systolic: latestResponse.data.wellness.bloodPressure?.systolic || 0,
          diastolic: latestResponse.data.wellness.bloodPressure?.diastolic || 0,
          weight: latestResponse.data.wellness.weight || 0,
          height: latestResponse.data.wellness.height || 0,
          caloriesBurned: latestResponse.data.wellness.caloriesBurned || 0,
          sleepHours: latestResponse.data.wellness.sleepHours || 0,
          notes: latestResponse.data.wellness.notes || ''
        })
      }
      setWellnessHistory(historyResponse.data.wellnessData || [])
    } catch (error) {
      console.error('Error loading wellness data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      const updateData = {
        ...profileData,
        address: profileData.address ? { street: profileData.address } : undefined
      }
      const response = await api.put('/users/profile', updateData)
      setUser(response.data.user)
      setEditingProfile(false)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' })
    }
  }

  const handleWellnessUpdate = async (e) => {
    e.preventDefault()
    try {
      const updateData = {
        steps: parseInt(wellnessData.steps) || 0,
        heartRate: parseInt(wellnessData.heartRate) || 0,
        bloodPressure: {
          systolic: parseInt(wellnessData.systolic) || 0,
          diastolic: parseInt(wellnessData.diastolic) || 0
        },
        weight: parseFloat(wellnessData.weight) || 0,
        height: parseFloat(wellnessData.height) || 0,
        caloriesBurned: parseInt(wellnessData.caloriesBurned) || 0,
        sleepHours: parseFloat(wellnessData.sleepHours) || 0,
        notes: wellnessData.notes || ''
      }
      await api.post('/wellness/my-wellness', updateData)
      setEditingWellness(false)
      setMessage({ type: 'success', text: 'Wellness data updated successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      loadWellnessData()
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update wellness data' })
    }
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
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
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
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
                {!editingProfile && (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProfile(false)
                        loadUserData()
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  {user?.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  )}
                  {user?.dateOfBirth && (
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                  )}
                  {user?.address?.street && (
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{user.address.street}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Wellness Progress Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Wellness Progress</h2>
                {!editingWellness && (
                  <button
                    onClick={() => setEditingWellness(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  >
                    Update Progress
                  </button>
                )}
              </div>

              {editingWellness ? (
                <form onSubmit={handleWellnessUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
                      <input
                        type="number"
                        value={wellnessData.steps}
                        onChange={(e) => setWellnessData({ ...wellnessData, steps: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                      <input
                        type="number"
                        value={wellnessData.heartRate}
                        onChange={(e) => setWellnessData({ ...wellnessData, heartRate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP</label>
                      <input
                        type="number"
                        value={wellnessData.systolic}
                        onChange={(e) => setWellnessData({ ...wellnessData, systolic: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP</label>
                      <input
                        type="number"
                        value={wellnessData.diastolic}
                        onChange={(e) => setWellnessData({ ...wellnessData, diastolic: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={wellnessData.weight}
                        onChange={(e) => setWellnessData({ ...wellnessData, weight: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={wellnessData.height}
                        onChange={(e) => setWellnessData({ ...wellnessData, height: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Calories Burned</label>
                      <input
                        type="number"
                        value={wellnessData.caloriesBurned}
                        onChange={(e) => setWellnessData({ ...wellnessData, caloriesBurned: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Hours</label>
                      <input
                        type="number"
                        step="0.1"
                        value={wellnessData.sleepHours}
                        onChange={(e) => setWellnessData({ ...wellnessData, sleepHours: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        min="0"
                        max="24"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={wellnessData.notes}
                      onChange={(e) => setWellnessData({ ...wellnessData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      rows="3"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingWellness(false)
                        loadWellnessData()
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-primary-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Steps</p>
                    <p className="text-2xl font-bold text-primary-600">{wellness?.steps || 0}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Heart Rate</p>
                    <p className="text-2xl font-bold text-red-600">{wellness?.heartRate || 0} bpm</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Blood Pressure</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {wellness?.bloodPressure?.systolic || 0}/{wellness?.bloodPressure?.diastolic || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-2xl font-bold text-green-600">{wellness?.weight || 0} kg</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Height</p>
                    <p className="text-2xl font-bold text-purple-600">{wellness?.height || 0} cm</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Calories</p>
                    <p className="text-2xl font-bold text-yellow-600">{wellness?.caloriesBurned || 0}</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Sleep</p>
                    <p className="text-2xl font-bold text-indigo-600">{wellness?.sleepHours || 0} hrs</p>
                  </div>
                  {wellness?.notes && (
                    <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="text-sm text-gray-800">{wellness.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {wellnessHistory.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent History</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {wellnessHistory.slice(0, 10).map((entry, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm font-medium">
                          Steps: {entry.steps} | HR: {entry.heartRate} bpm
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard



