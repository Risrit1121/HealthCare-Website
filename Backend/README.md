# Healthcare Management System - Backend

## 📋 Project Overview
A complete healthcare management system backend built with Node.js, Express, MongoDB, and JWT authentication. Supports role-based access for patients and healthcare providers (doctors).

---

## 🏗️ Architecture & Workflow Design

### **System Flow Diagram**
```
Client Request → Express Server → Middleware (Auth) → Route Handler → MongoDB → Response
```

---

## 🗄️ Database Design (MongoDB)

### **Why MongoDB?**
- **Flexible Schema**: Healthcare data varies (patient records, prescriptions, appointments)
- **Document-Based**: Natural fit for nested data (prescriptions with medicine arrays)
- **Scalability**: Easy horizontal scaling for growing patient/doctor base
- **Relationships**: ObjectId references for user-appointment-prescription relationships

### **Collections & Models**

#### **1. Users Collection**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  role: String (enum: ['patient', 'provider'], required),
  bloodType: String (optional),
  disease: String (optional),
  age: Number (optional),
  createdAt: Date (default: now)
}
```
**Purpose**: Stores both patients and doctors in one collection, differentiated by `role`
**Why**: Unified authentication, shared fields (name, email), role-based access control

#### **2. Appointments Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required) → Patient who booked,
  doctorId: ObjectId (ref: 'User', required) → Doctor assigned,
  name: String (required),
  email: String (required),
  phone: String (required),
  department: String (required),
  date: Date (required),
  message: String (optional),
  status: String (default: 'pending'),
  createdAt: Date (default: now)
}
```
**Purpose**: Tracks patient-doctor appointments
**Relationships**: 
- `userId` → References patient in Users collection
- `doctorId` → References doctor in Users collection
**Why**: Enables querying appointments by patient or doctor, maintains appointment history

#### **3. Prescriptions Collection**
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: 'User', required) → Patient,
  doctorId: ObjectId (ref: 'User', required) → Prescribing doctor,
  medicines: [
    {
      name: String,
      tablets: Number,
      frequencyPerDay: Number,
      durationDays: Number
    }
  ],
  diagnosis: String,
  notes: String,
  createdAt: Date (default: now)
}
```
**Purpose**: Stores medical prescriptions with medicine details
**Relationships**:
- `patientId` → References patient in Users collection
- `doctorId` → References doctor in Users collection
**Why**: Nested medicine array allows multiple medications per prescription, maintains medical history

---

## 🔐 Middleware Architecture

### **auth.js Middleware**

#### **1. verifyToken**
```javascript
Purpose: Validates JWT token from Authorization header
Flow:
1. Extract token from "Bearer <token>" format
2. Verify token using JWT_SECRET
3. Decode user data (id, email, role)
4. Attach decoded data to req.user
5. Call next() or return 401 error

Used in: All protected routes
```

#### **2. verifyRole**
```javascript
Purpose: Checks if user has required role(s)
Flow:
1. Check if req.user.role matches allowed roles array
2. Return 403 if unauthorized, call next() if authorized

Used in: Doctor-only routes (patients, prescriptions)
```

**Middleware Chain Example**:
```
Request → verifyToken → verifyRole(['provider']) → Route Handler
```

---

## 🔄 Complete API Workflow

### **1. User Registration Flow**
```
POST /api/auth/register
↓
1. Validate input (email, password, name, role)
2. Check if user exists (email unique)
3. Hash password with bcrypt (10 salt rounds)
4. Create user document in MongoDB
5. Generate JWT token (id, email, role)
6. Return token + user data (without password)

MongoDB Storage:
{
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$hashed...",
  role: "patient",
  createdAt: ISODate("2025-11-29...")
}
```

### **2. User Login Flow**
```
POST /api/auth/login
↓
1. Validate input (email, password, role)
2. Find user by email AND role
3. Compare password with bcrypt.compare()
4. Generate JWT token if valid
5. Return token + user data

Why role in query: Same email can't be both patient and doctor
```

### **3. Token Verification Flow**
```
GET /api/auth/verify
↓
1. verifyToken middleware extracts & validates JWT
2. Find user by decoded ID
3. Return user data (excluding password)

Used by: Frontend to check if user is still authenticated
```

### **4. Appointment Booking Flow**
```
POST /api/appointments
↓
1. verifyToken middleware (ensures authenticated)
2. Validate required fields
3. Create appointment with userId (from token) and doctorId
4. Store in MongoDB with status: 'pending'
5. Return appointment data

MongoDB Storage:
{
  userId: ObjectId("patient_id"),
  doctorId: ObjectId("doctor_id"),
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  department: "Cardiology",
  date: ISODate("2025-12-01..."),
  status: "pending",
  createdAt: ISODate("2025-11-29...")
}
```

### **5. Get Appointments Flow (Role-Based)**
```
GET /api/appointments
↓
1. verifyToken middleware
2. Check user role:
   - If provider: query = { doctorId: user.id }
   - If patient: query = { userId: user.id }
3. Find appointments with query
4. Populate userId and doctorId (get name, email)
5. Sort by createdAt (newest first)
6. Return appointments array

Why populate: Converts ObjectId to actual user data
```

### **6. Get Single Appointment Flow**
```
GET /api/appointments/:id
↓
1. verifyToken middleware
2. Find appointment by _id
3. Populate userId (patient details)
4. Return appointment or 404

Use case: View appointment details
```

### **7. Delete Appointment Flow**
```
DELETE /api/appointments/:id
↓
1. verifyToken middleware
2. Find and delete appointment by _id
3. Return success message or 404

MongoDB: Document removed from Appointments collection
```

### **8. Get Doctors Flow**
```
GET /api/doctors
↓
1. No authentication required (public)
2. Find all users with role: 'provider'
3. Select only name and email fields
4. Return doctors array

Why public: Patients need to see doctors before registering
```

### **9. Get Patients Flow (Doctor Only)**
```
GET /api/patients
↓
1. verifyToken middleware
2. Check if role === 'provider' (403 if not)
3. Find all users with role: 'patient'
4. Select name, email, bloodType, disease, age, createdAt
5. Return patients array

Why doctor-only: Patient privacy, medical records access control
```

### **10. Create Prescription Flow (Doctor Only)**
```
POST /api/prescriptions
↓
1. verifyToken middleware
2. Check if role === 'provider' (403 if not)
3. Validate input (patientId, medicines, diagnosis)
4. Create prescription with doctorId from token
5. Store in MongoDB
6. Return prescription data

MongoDB Storage:
{
  patientId: ObjectId("patient_id"),
  doctorId: ObjectId("doctor_id"),
  medicines: [
    {
      name: "Aspirin",
      tablets: 10,
      frequencyPerDay: 2,
      durationDays: 5
    }
  ],
  diagnosis: "Fever",
  notes: "Take after meals",
  createdAt: ISODate("2025-11-29...")
}
```

### **11. Get Prescriptions Flow (Role-Based)**
```
GET /api/prescriptions
↓
1. verifyToken middleware
2. Check user role:
   - If provider: query = {} (all prescriptions)
   - If patient: query = { patientId: user.id }
3. Find prescriptions with query
4. Populate patientId (name, email) and doctorId (name)
5. Sort by createdAt (newest first)
6. Return prescriptions array

Why different queries: Doctors see all, patients see only theirs
```

---

## 🔑 Authentication & Security

### **JWT Token Structure**
```javascript
Payload: {
  id: user._id,
  email: user.email,
  role: user.role
}
Secret: process.env.JWT_SECRET
Expiry: process.env.JWT_EXPIRES_IN (e.g., '7d')
```

### **Password Security**
- **Hashing**: bcrypt with 10 salt rounds
- **Storage**: Only hashed passwords in database
- **Verification**: bcrypt.compare() for login

### **Authorization Levels**
1. **Public**: `/api/doctors` (no auth)
2. **Authenticated**: All users with valid token
3. **Role-Based**: Doctors only for patients/prescriptions

---

## 📊 Data Relationships

```
User (Patient)
  ↓ (userId)
Appointment ← (doctorId) → User (Doctor)
  
User (Patient)
  ↓ (patientId)
Prescription ← (doctorId) → User (Doctor)
```

**Mongoose Populate**: Converts ObjectId references to actual documents
```javascript
.populate('userId', 'name email')  // Replaces userId with {name, email}
```

---

## 🚀 Server Initialization Flow

```
1. Load environment variables (.env)
2. Initialize Express app
3. Apply middleware (cors, express.json)
4. Connect to MongoDB
5. Seed doctors (if not exist)
6. Register all routes
7. Start server on PORT
```

### **Doctor Seeding**
```javascript
On MongoDB connection:
1. Check if doctors exist by email
2. If not, create 4 default doctors with hashed passwords
3. Log success message

Why: Ensures doctors available for appointments immediately
```

---

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **CORS**: cors middleware
- **Environment**: dotenv

---

## 📁 Project Structure

```
Backend/
├── middleware/
│   └── auth.js              # JWT verification & role checking
├── models/
│   ├── User.js              # User schema (patients + doctors)
│   ├── Appointment.js       # Appointment schema
│   └── Prescription.js      # Prescription schema
├── server.js                # Main application file
├── .env                     # Environment variables
└── package.json             # Dependencies
```

---

## 🔧 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/healthcare
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
PORT=3000
```

---

## 📝 API Endpoints Summary

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | ❌ | All | Register new user |
| POST | `/api/auth/login` | ❌ | All | Login user |
| GET | `/api/auth/verify` | ✅ | All | Verify token |
| POST | `/api/appointments` | ✅ | All | Create appointment |
| GET | `/api/appointments` | ✅ | All | Get appointments (role-based) |
| GET | `/api/appointments/:id` | ✅ | All | Get single appointment |
| DELETE | `/api/appointments/:id` | ✅ | All | Cancel appointment |
| GET | `/api/doctors` | ❌ | All | Get all doctors |
| GET | `/api/patients` | ✅ | Provider | Get all patients |
| POST | `/api/prescriptions` | ✅ | Provider | Create prescription |
| GET | `/api/prescriptions` | ✅ | All | Get prescriptions (role-based) |

---

## 🎯 Key Design Decisions

### **1. Single User Collection**
- **Why**: Shared authentication logic, unified user management
- **How**: `role` field differentiates patients from doctors

### **2. JWT in Headers**
- **Why**: Stateless authentication, scalable
- **Format**: `Authorization: Bearer <token>`

### **3. Password Hashing**
- **Why**: Security - never store plain passwords
- **Method**: bcrypt with salt rounds

### **4. Role-Based Queries**
- **Why**: Data privacy and access control
- **Implementation**: Different MongoDB queries based on `req.user.role`

### **5. ObjectId References**
- **Why**: Maintain relationships without data duplication
- **Benefit**: Easy to populate related data, update once affects all references

### **6. Timestamps**
- **Why**: Track creation time for sorting and history
- **Field**: `createdAt` with default `Date.now`

---

## 🔄 Request-Response Cycle Example

### **Creating an Appointment**

```
1. CLIENT REQUEST
   POST /api/appointments
   Headers: { Authorization: "Bearer eyJhbGc..." }
   Body: {
     name: "John Doe",
     email: "john@example.com",
     phone: "1234567890",
     department: "Cardiology",
     date: "2025-12-01",
     doctorId: "673f8a2b1c9d440000a1b2c3"
   }

2. EXPRESS SERVER
   → Receives request
   → Parses JSON body

3. MIDDLEWARE (verifyToken)
   → Extracts token from header
   → Verifies with JWT_SECRET
   → Decodes: { id: "user123", email: "john@...", role: "patient" }
   → Attaches to req.user
   → Calls next()

4. ROUTE HANDLER
   → Validates required fields
   → Creates appointment object:
     {
       userId: req.user.id,  // From token
       doctorId: req.body.doctorId,
       name: req.body.name,
       email: req.body.email,
       phone: req.body.phone,
       department: req.body.department,
       date: req.body.date,
       message: req.body.message,
       status: 'pending',
       createdAt: new Date()
     }

5. MONGODB
   → Inserts document into Appointments collection
   → Returns inserted document with _id

6. RESPONSE
   Status: 201 Created
   Body: {
     message: "Appointment booked successfully",
     appointment: { _id: "...", userId: "...", ... }
   }

7. CLIENT
   → Receives response
   → Updates UI with appointment data
```

---

## 🧪 Testing the API

### **1. Register a Patient**
```bash
POST http://localhost:3000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}
```

### **2. Login**
```bash
POST http://localhost:3000/api/auth/login
{
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}
# Save the returned token
```

### **3. Get Doctors**
```bash
GET http://localhost:3000/api/doctors
# No auth required
```

### **4. Book Appointment**
```bash
POST http://localhost:3000/api/appointments
Headers: { Authorization: "Bearer <token>" }
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "department": "Cardiology",
  "date": "2025-12-01",
  "doctorId": "<doctor_id_from_step_3>"
}
```

---

## 🔒 Security Best Practices Implemented

1. **Password Hashing**: bcrypt with salt
2. **JWT Expiration**: Tokens expire after set time
3. **Role-Based Access**: Middleware checks user roles
4. **Input Validation**: Required field checks
5. **Error Handling**: Try-catch blocks, proper status codes
6. **CORS**: Configured for cross-origin requests
7. **Environment Variables**: Sensitive data in .env

---

## 📈 Scalability Considerations

1. **Stateless Auth**: JWT allows horizontal scaling
2. **MongoDB Indexing**: Unique email, indexed ObjectIds
3. **Populate Optimization**: Select only needed fields
4. **Query Optimization**: Role-based filtering at DB level
5. **Modular Structure**: Separate models, middleware, routes

---

## 🐛 Error Handling

All routes include try-catch blocks:
- **400**: Bad request (validation errors)
- **401**: Unauthorized (invalid token/credentials)
- **403**: Forbidden (insufficient permissions)
- **404**: Not found (resource doesn't exist)
- **500**: Server error (unexpected errors)

---

## 👥 Default Seeded Doctors

| Name | Email | Password | Role |
|------|-------|----------|------|
| Dr Rishi Cheekatla | rishi@healthcare.com | rishi123 | provider |
| Dr HemaSri | hemasri@healthcare.com | hema123 | provider |
| Dr Purvi | purvi@healthcare.com | purvi123 | provider |
| Dr Akshaya | akshaya@healthcare.com | akshaya123 | provider |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start server
npm start

# Development mode with auto-restart
npm run dev
```

---

## 📚 Dependencies

```json
{
  "express": "Web framework",
  "mongoose": "MongoDB ODM",
  "jsonwebtoken": "JWT authentication",
  "bcryptjs": "Password hashing",
  "cors": "Cross-origin resource sharing",
  "dotenv": "Environment variables"
}
```

---

## 🎓 Learning Outcomes

This project demonstrates:
- RESTful API design
- JWT authentication & authorization
- Role-based access control (RBAC)
- MongoDB relationships with Mongoose
- Middleware architecture
- Password security with bcrypt
- Error handling & validation
- Environment configuration
- MVC-like structure (Models, Routes, Middleware)

---

## 📞 Support

For issues or questions, refer to the code comments or MongoDB/Express documentation.
