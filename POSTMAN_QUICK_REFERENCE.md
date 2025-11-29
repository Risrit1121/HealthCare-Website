# 🚀 Postman Quick Reference

## Base URL
```
http://localhost:3000
```

---

## 📋 All API Endpoints

| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| POST | `/api/auth/register` | ❌ | Any | Register new user |
| POST | `/api/auth/login` | ❌ | Any | Login user |
| GET | `/api/auth/verify` | ✅ | Any | Verify token |
| GET | `/api/doctors` | ❌ | Any | Get all doctors |
| GET | `/api/patients` | ✅ | Doctor | Get all patients |
| POST | `/api/appointments` | ✅ | Patient | Book appointment |
| GET | `/api/appointments` | ✅ | Patient | Get my appointments |
| GET | `/api/appointments/doctor` | ✅ | Doctor | Get doctor's appointments |
| PUT | `/api/appointments/:id` | ✅ | Doctor | Update appointment status |
| POST | `/api/prescriptions` | ✅ | Doctor | Create prescription |
| GET | `/api/prescriptions` | ✅ | Patient | Get my prescriptions |
| GET | `/api/prescriptions/doctor` | ✅ | Doctor | Get doctor's prescriptions |

---

## 🔑 Quick cURL Commands

### 1. Register Patient
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "patient"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "patient"
  }'
```

### 3. Get Doctors
```bash
curl http://localhost:3000/api/doctors
```

### 4. Book Appointment (Replace TOKEN)
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "doctorId": "692aa48c82b82e53d49c87bd",
    "date": "2025-12-01",
    "time": "10:00",
    "reason": "Checkup"
  }'
```

### 5. Get My Appointments (Replace TOKEN)
```bash
curl http://localhost:3000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🧪 Test Credentials

### Doctors (Pre-seeded):
```
rishi@healthcare.com / rishi123
hemasri@healthcare.com / hema123
purvi@healthcare.com / purvi123
akshaya@healthcare.com / akshaya123
```

### Doctor IDs:
```
Dr Rishi: 692aa48c82b82e53d49c87bd
Dr HemaSri: 692aa48c82b82e53d49c87c0
Dr Purvi: 692aa48c82b82e53d49c87c3
Dr Akshaya: 692aa48c82b82e53d49c87c6
```

---

## 📦 Sample Request Bodies

### Register Patient
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "pass123",
  "role": "patient",
  "phone": "9876543210",
  "dateOfBirth": "1995-05-15",
  "gender": "female",
  "address": "456 Oak Ave"
}
```

### Login
```json
{
  "email": "jane@example.com",
  "password": "pass123",
  "role": "patient"
}
```

### Book Appointment
```json
{
  "doctorId": "692aa48c82b82e53d49c87bd",
  "date": "2025-12-05",
  "time": "14:30",
  "reason": "Follow-up consultation"
}
```

### Create Prescription (Doctor)
```json
{
  "patientId": "PATIENT_ID",
  "appointmentId": "APPOINTMENT_ID",
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "5 days"
    }
  ],
  "diagnosis": "Fever",
  "notes": "Rest and drink plenty of fluids"
}
```

### Update Appointment Status (Doctor)
```json
{
  "status": "confirmed"
}
```
**Status options:** `pending`, `confirmed`, `completed`, `cancelled`

---

## 🎯 Testing Workflow

### Patient Flow:
```
1. POST /api/auth/register (role: patient)
2. POST /api/auth/login → Save token
3. GET /api/doctors → Get doctor ID
4. POST /api/appointments (with doctor ID)
5. GET /api/appointments → View bookings
6. GET /api/prescriptions → View prescriptions
```

### Doctor Flow:
```
1. POST /api/auth/login (use pre-seeded doctor)
2. GET /api/patients → View all patients
3. GET /api/appointments/doctor → View appointments
4. PUT /api/appointments/:id → Update status
5. POST /api/prescriptions → Create prescription
6. GET /api/prescriptions/doctor → View all prescriptions
```

---

## ✅ Connection Status

**Backend:** ✅ Running on http://localhost:3000
**Frontend:** ✅ Running on http://localhost:3001
**MongoDB:** ✅ Connected to mongodb://localhost:27017/healthcare

**API Configuration in Frontend:**
```javascript
const API_URL = 'http://localhost:3000/api';
```

**Proxy in package.json:**
```json
"proxy": "http://localhost:3000"
```

---

## 🔍 Verify Connection

```bash
# Test backend
curl http://localhost:3000/api/doctors

# Test frontend
curl http://localhost:3001

# Check processes
lsof -ti:3000  # Backend
lsof -ti:3001  # Frontend
```

---

## 💡 Tips

1. **Save Token:** After login, copy the token from response
2. **Authorization Header:** Format is `Bearer YOUR_TOKEN`
3. **Doctor IDs:** Use the IDs from "Get Doctors" response
4. **Role-Based Access:** Some endpoints require specific roles
5. **CORS:** Already configured for localhost:3001

---

**📄 Full Documentation:** See `POSTMAN_API_CALLS.md`
