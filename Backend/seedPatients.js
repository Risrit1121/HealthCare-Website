require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const patients = [
  { name: 'John Smith', email: 'john.smith@email.com', password: 'patient123', bloodType: 'O+', disease: 'Hypertension', age: 45 },
  { name: 'Sarah Johnson', email: 'sarah.j@email.com', password: 'patient123', bloodType: 'A+', disease: 'Diabetes Type 2', age: 52 },
  { name: 'Michael Brown', email: 'michael.b@email.com', password: 'patient123', bloodType: 'B+', disease: 'Asthma', age: 38 },
  { name: 'Emily Davis', email: 'emily.d@email.com', password: 'patient123', bloodType: 'AB+', disease: 'None', age: 29 },
  { name: 'David Wilson', email: 'david.w@email.com', password: 'patient123', bloodType: 'O-', disease: 'Arthritis', age: 61 },
  { name: 'Jessica Martinez', email: 'jessica.m@email.com', password: 'patient123', bloodType: 'A-', disease: 'Migraine', age: 34 },
  { name: 'Robert Taylor', email: 'robert.t@email.com', password: 'patient123', bloodType: 'B-', disease: 'High Cholesterol', age: 48 },
  { name: 'Lisa Anderson', email: 'lisa.a@email.com', password: 'patient123', bloodType: 'AB-', disease: 'None', age: 27 },
  { name: 'James Thomas', email: 'james.t@email.com', password: 'patient123', bloodType: 'O+', disease: 'Thyroid', age: 55 },
  { name: 'Maria Garcia', email: 'maria.g@email.com', password: 'patient123', bloodType: 'A+', disease: 'Anemia', age: 42 }
];

async function seedPatients() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare');
    console.log('✅ Connected to MongoDB');

    for (const patient of patients) {
      const exists = await User.findOne({ email: patient.email });
      if (!exists) {
        const hashedPassword = await bcrypt.hash(patient.password, 10);
        await User.create({
          name: patient.name,
          email: patient.email,
          password: hashedPassword,
          role: 'patient',
          bloodType: patient.bloodType,
          disease: patient.disease,
          age: patient.age
        });
        console.log(`✅ Created patient: ${patient.name}`);
      } else {
        console.log(`⏭️  Patient already exists: ${patient.name}`);
      }
    }

    console.log('\n🎉 Patient seeding complete!');
    console.log(`\n📊 Total patients: ${patients.length}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedPatients();
