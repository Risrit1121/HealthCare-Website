require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { verifyToken } = require('./middleware/auth');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const Prescription = require('./models/Prescription');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare')
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// Seed doctors
async function seedDoctors() {
  const doctors = [
    { name: 'Dr Rishi Cheekatla', email: 'rishi@healthcare.com', password: 'rishi123', role: 'provider' },
    { name: 'Dr HemaSri', email: 'hemasri@healthcare.com', password: 'hema123', role: 'provider' },
    { name: 'Dr Purvi', email: 'purvi@healthcare.com', password: 'purvi123', role: 'provider' },
    { name: 'Dr Akshaya', email: 'akshaya@healthcare.com', password: 'akshaya123', role: 'provider' }
  ];

  for (const doctor of doctors) {
    const exists = await User.findOne({ email: doctor.email });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(doctor.password, 10);
      await User.create({ ...doctor, password: hashedPassword });
    }
  }
  console.log('✅ Doctors seeded');
}

mongoose.connection.once('open', () => {
  seedDoctors();
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['patient', 'provider'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name, role });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify token
app.get('/api/auth/verify', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create appointment
app.post('/api/appointments', verifyToken, async (req, res) => {
  try {
    const { name, email, phone, department, date, message, doctorId } = req.body;
    
    if (!name || !email || !phone || !department || !date || !doctorId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const appointment = await Appointment.create({
      userId: req.user.id,
      doctorId,
      name,
      email,
      phone,
      department,
      date,
      message
    });

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get appointments
app.get('/api/appointments', verifyToken, async (req, res) => {
  try {
    let query;
    if (req.user.role === 'provider') {
      query = { doctorId: req.user.id };
    } else {
      query = { userId: req.user.id };
    }
    const appointments = await Appointment.find(query)
      .populate('userId', 'name email')
      .populate('doctorId', 'name email')
      .sort('-createdAt');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single appointment
app.get('/api/appointments/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('userId', 'name email');
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete appointment
app.delete('/api/appointments/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'provider' }).select('name email');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patients (for doctors only)
app.get('/api/patients', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ error: 'Access denied. Doctors only.' });
    }
    const patients = await User.find({ role: 'patient' }).select('name email bloodType disease age createdAt');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create prescription (doctors only)
app.post('/api/prescriptions', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ error: 'Access denied. Doctors only.' });
    }
    const { patientId, medicines, diagnosis, notes } = req.body;
    const prescription = await Prescription.create({
      patientId,
      doctorId: req.user.id,
      medicines,
      diagnosis,
      notes
    });
    res.status(201).json({ message: 'Prescription created', prescription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get prescriptions (doctors see all, patients see their own)
app.get('/api/prescriptions', verifyToken, async (req, res) => {
  try {
    const query = req.user.role === 'provider' 
      ? {} 
      : { patientId: req.user.id };
    const prescriptions = await Prescription.find(query)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name')
      .sort('-createdAt');
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🏥 Healthcare API running on http://localhost:${PORT}`);
  console.log('\n👨‍⚕️ Available Doctors:');
  console.log('1. Dr Rishi Cheekatla - rishi@healthcare.com / rishi123');
  console.log('2. Dr HemaSri - hemasri@healthcare.com / hema123');
  console.log('3. Dr Purvi - purvi@healthcare.com / purvi123');
  console.log('4. Dr Akshaya - akshaya@healthcare.com / akshaya123');
});
