# 🚀 Quick Login Reference

## 🌐 Access Application
**URL:** http://localhost:3001

---

## 👨‍⚕️ DOCTORS (Healthcare Providers)

### Dr Rishi Cheekatla
- **Email:** rishi@healthcare.com
- **Password:** rishi123
- **Role:** Healthcare Provider

### Dr HemaSri
- **Email:** hemasri@healthcare.com
- **Password:** hema123
- **Role:** Healthcare Provider

### Dr Purvi
- **Email:** purvi@healthcare.com
- **Password:** purvi123
- **Role:** Healthcare Provider

### Dr Akshaya
- **Email:** akshaya@healthcare.com
- **Password:** akshaya123
- **Role:** Healthcare Provider

---

## 👥 PATIENTS

**All patients use password:** `patient123`

### Quick Test Patients

1. **John Smith** - john.smith@email.com
2. **Sarah Johnson** - sarah.j@email.com
3. **Michael Brown** - michael.b@email.com
4. **Emily Davis** - emily.d@email.com
5. **David Wilson** - david.w@email.com
6. **Jessica Martinez** - jessica.m@email.com
7. **Robert Taylor** - robert.t@email.com
8. **Lisa Anderson** - lisa.a@email.com
9. **James Thomas** - james.t@email.com
10. **Maria Garcia** - maria.g@email.com

---

## 📊 Database Summary

```
Total Users: 14
├── Doctors: 4
└── Patients: 10
```

---

## 🎯 Quick Test

### Test as Doctor
1. Go to http://localhost:3001
2. Select "Healthcare Provider"
3. Email: `rishi@healthcare.com`
4. Password: `rishi123`
5. ✅ View all appointments

### Test as Patient
1. Go to http://localhost:3001
2. Select "Patient"
3. Email: `john.smith@email.com`
4. Password: `patient123`
5. ✅ View wellness dashboard

---

## 🔄 Re-seed Data

### Re-seed Patients
```bash
cd Backend
node seedPatients.js
```

### View Database
```bash
mongosh healthcare --eval "db.users.find().pretty()"
```

---

**All credentials stored securely in MongoDB with bcrypt hashing!** 🔐
