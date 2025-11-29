# MongoDB Setup Guide

## ✅ MongoDB is Configured!

Your healthcare application now uses MongoDB to store:
- **Users** (Patients & Doctors)
- **Appointments**

## 📊 Database Info

- **Database Name:** `healthcare`
- **Connection URI:** `mongodb://localhost:27017/healthcare`
- **Collections:**
  - `users` - Stores all users (patients and providers)
  - `appointments` - Stores appointment bookings

## 🔍 View Data

### Using MongoDB Shell
```bash
# Connect to database
mongosh healthcare

# View all users
db.users.find().pretty()

# View all appointments
db.appointments.find().pretty()

# Count documents
db.users.countDocuments()
db.appointments.countDocuments()

# Find doctors only
db.users.find({ role: 'provider' })

# Find patients only
db.users.find({ role: 'patient' })
```

### Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Select `healthcare` database
4. Browse collections

## 🗄️ Data Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'patient' | 'provider',
  createdAt: Date
}
```

### Appointment Schema
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  email: String,
  phone: String,
  department: String,
  date: Date,
  message: String,
  status: String (default: 'pending'),
  createdAt: Date
}
```

## 🔄 Auto-Seeded Data

On first run, 4 doctors are automatically created:
- Dr Rishi Cheekatla
- Dr HemaSri
- Dr Purvi
- Dr Akshaya

These are stored in MongoDB and persist across restarts.

## 🛠️ MongoDB Commands

### Start MongoDB
```bash
brew services start mongodb/brew/mongodb-community
```

### Stop MongoDB
```bash
brew services stop mongodb/brew/mongodb-community
```

### Restart MongoDB
```bash
brew services restart mongodb/brew/mongodb-community
```

### Check Status
```bash
brew services list | grep mongodb
```

## 🧹 Reset Database

To clear all data and start fresh:
```bash
mongosh healthcare --eval "db.dropDatabase()"
```

Then restart the backend to re-seed doctors.

## 📝 Notes

- Data persists across server restarts
- Passwords are hashed with bcrypt (never stored in plain text)
- MongoDB runs on default port 27017
- Database is created automatically on first connection
- Indexes are created automatically by Mongoose
