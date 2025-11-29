# Healthcare API - Postman Calls

**Base URL:** `http://localhost:3000`

---

## 1. 🔐 Authentication APIs

### 1.1 Register Patient
**Endpoint:** `POST /api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient",
  "phone": "1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "address": "123 Main St"
}
```

**Response (200):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

---

### 1.2 Register Doctor
**Endpoint:** `POST /api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Dr. Smith",
  "email": "smith@healthcare.com",
  "password": "doctor123",
  "role": "provider"
}
```

---

### 1.3 Login
**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

**💡 Note:** Save the `token` from response for authenticated requests!

---

### 1.4 Verify Token
**Endpoint:** `GET /api/auth/verify`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**
```json
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

---

## 2. 👨‍⚕️ Doctor APIs

### 2.1 Get All Doctors
**Endpoint:** `GET /api/doctors`

**Headers:** None required

**Response (200):**
```json
[
  {
    "_id": "692aa48c82b82e53d49c87bd",
    "name": "Dr Rishi Cheekatla",
    "email": "rishi@healthcare.com"
  },
  {
    "_id": "692aa48c82b82e53d49c87c0",
    "name": "Dr HemaSri",
    "email": "hemasri@healthcare.com"
  },
  {
    "_id": "692aa48c82b82e53d49c87c3",
    "name": "Dr Purvi",
    "email": "purvi@healthcare.com"
  },
  {
    "_id": "692aa48c82b82e53d49c87c6",
    "name": "Dr Akshaya",
    "email": "akshaya@healthcare.com"
  }
]
```

---

## 3. 👥 Patient APIs

### 3.1 Get All Patients (Doctor Only)
**Endpoint:** `GET /api/patients`

**Headers:**
```
Authorization: Bearer YOUR_DOCTOR_TOKEN_HERE
```

**Response (200):**
```json
[
  {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "address": "123 Main St"
  }
]
```

---

## 4. 📅 Appointment APIs

### 4.1 Book Appointment (Patient)
**Endpoint:** `POST /api/appointments`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_PATIENT_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "doctorId": "692aa48c82b82e53d49c87bd",
  "date": "2025-12-01",
  "time": "10:00",
  "reason": "Regular Checkup"
}
```

**Response (201):**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "...",
    "patientId": "...",
    "doctorId": "692aa48c82b82e53d49c87bd",
    "date": "2025-12-01",
    "time": "10:00",
    "reason": "Regular Checkup",
    "status": "pending"
  }
}
```

---

### 4.2 Get My Appointments (Patient)
**Endpoint:** `GET /api/appointments`

**Headers:**
```
Authorization: Bearer YOUR_PATIENT_TOKEN_HERE
```

**Response (200):**
```json
[
  {
    "_id": "...",
    "doctorId": {
      "_id": "692aa48c82b82e53d49c87bd",
      "name": "Dr Rishi Cheekatla"
    },
    "date": "2025-12-01",
    "time": "10:00",
    "reason": "Regular Checkup",
    "status": "pending"
  }
]
```

---

### 4.3 Get Doctor's Appointments (Doctor)
**Endpoint:** `GET /api/appointments/doctor`

**Headers:**
```
Authorization: Bearer YOUR_DOCTOR_TOKEN_HERE
```

**Response (200):**
```json
[
  {
    "_id": "...",
    "patientId": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "date": "2025-12-01",
    "time": "10:00",
    "reason": "Regular Checkup",
    "status": "pending"
  }
]
```

---

### 4.4 Update Appointment Status (Doctor)
**Endpoint:** `PUT /api/appointments/:appointmentId`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_DOCTOR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "status": "confirmed"
}
```

**Possible Status Values:**
- `pending`
- `confirmed`
- `completed`
- `cancelled`

**Response (200):**
```json
{
  "message": "Appointment updated successfully",
  "appointment": {
    "_id": "...",
    "status": "confirmed"
  }
}
```

---

## 5. 💊 Prescription APIs

### 5.1 Create Prescription (Doctor)
**Endpoint:** `POST /api/prescriptions`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_DOCTOR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "patientId": "PATIENT_ID_HERE",
  "appointmentId": "APPOINTMENT_ID_HERE",
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "3 times daily",
      "duration": "7 days"
    }
  ],
  "diagnosis": "Bacterial Infection",
  "notes": "Take with food. Complete full course."
}
```

**Response (201):**
```json
{
  "message": "Prescription created successfully",
  "prescription": {
    "_id": "...",
    "patientId": "...",
    "doctorId": "...",
    "appointmentId": "...",
    "medications": [...],
    "diagnosis": "Bacterial Infection",
    "notes": "Take with food. Complete full course.",
    "createdAt": "2025-11-29T..."
  }
}
```

---

### 5.2 Get My Prescriptions (Patient)
**Endpoint:** `GET /api/prescriptions`

**Headers:**
```
Authorization: Bearer YOUR_PATIENT_TOKEN_HERE
```

**Response (200):**
```json
[
  {
    "_id": "...",
    "doctorId": {
      "_id": "...",
      "name": "Dr Rishi Cheekatla"
    },
    "medications": [
      {
        "name": "Amoxicillin",
        "dosage": "500mg",
        "frequency": "3 times daily",
        "duration": "7 days"
      }
    ],
    "diagnosis": "Bacterial Infection",
    "notes": "Take with food. Complete full course.",
    "createdAt": "2025-11-29T..."
  }
]
```

---

### 5.3 Get Prescriptions by Doctor (Doctor)
**Endpoint:** `GET /api/prescriptions/doctor`

**Headers:**
```
Authorization: Bearer YOUR_DOCTOR_TOKEN_HERE
```

**Response (200):**
```json
[
  {
    "_id": "...",
    "patientId": {
      "_id": "...",
      "name": "John Doe"
    },
    "medications": [...],
    "diagnosis": "Bacterial Infection",
    "createdAt": "2025-11-29T..."
  }
]
```

---

## 📝 Quick Test Credentials

### Pre-seeded Doctors:
```
Email: rishi@healthcare.com
Password: rishi123

Email: hemasri@healthcare.com
Password: hema123

Email: purvi@healthcare.com
Password: purvi123

Email: akshaya@healthcare.com
Password: akshaya123
```

### Test Patient:
```
Register a new patient using the Register API above
```

---

## 🔧 Postman Setup

1. **Import Collection:**
   - File: `Healthcare-API-Local.postman_collection.json`

2. **Set Environment Variables:**
   - `baseUrl`: `http://localhost:3000`
   - `token`: (Will be set after login)

3. **Workflow:**
   1. Login → Save token
   2. Use token in Authorization header for protected routes
   3. Format: `Bearer YOUR_TOKEN_HERE`

---

## ⚠️ Common Errors

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```
**Solution:** Add Authorization header with valid token

### 403 Forbidden
```json
{
  "error": "Access denied. Doctors only."
}
```
**Solution:** Use doctor token for doctor-only endpoints

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```
**Solution:** Check request body has all required fields

---

## 🚀 Testing Flow

### For Patients:
1. Register → Login → Get Doctors → Book Appointment → View Prescriptions

### For Doctors:
1. Login → View Patients → View Appointments → Update Status → Create Prescription

---

**✅ Your backend and frontend are connected!**
- Backend: http://localhost:3000
- Frontend: http://localhost:3001
- MongoDB: mongodb://localhost:27017/healthcare
