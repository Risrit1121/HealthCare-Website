# 👥 Dummy Patients - Login Credentials

## ✅ 10 Patients Created in MongoDB

All patients use the same password: **`patient123`**

### Patient List

| # | Name | Email | Password |
|---|------|-------|----------|
| 1 | John Smith | john.smith@email.com | patient123 |
| 2 | Sarah Johnson | sarah.j@email.com | patient123 |
| 3 | Michael Brown | michael.b@email.com | patient123 |
| 4 | Emily Davis | emily.d@email.com | patient123 |
| 5 | David Wilson | david.w@email.com | patient123 |
| 6 | Jessica Martinez | jessica.m@email.com | patient123 |
| 7 | Robert Taylor | robert.t@email.com | patient123 |
| 8 | Lisa Anderson | lisa.a@email.com | patient123 |
| 9 | James Thomas | james.t@email.com | patient123 |
| 10 | Maria Garcia | maria.g@email.com | patient123 |

## 🔐 How to Login as Patient

1. Go to http://localhost:3001
2. Select **"Patient"** role
3. Enter any patient email from above
4. Password: `patient123`
5. Click **"Sign In"**

## 📊 Database Status

```
Total Users: 14
├── Doctors: 4
└── Patients: 10
```

## 🧪 Test Accounts

### Quick Test Logins

**Patient 1:**
- Email: `john.smith@email.com`
- Password: `patient123`

**Patient 2:**
- Email: `sarah.j@email.com`
- Password: `patient123`

**Doctor:**
- Email: `rishi@healthcare.com`
- Password: `rishi123`

## 🔄 Re-seed Patients

If you need to reset or add more patients:

```bash
cd Backend
node seedPatients.js
```

## 📝 Notes

- All passwords are hashed with bcrypt
- Patients stored in MongoDB `users` collection
- Each patient has role: `patient`
- Data persists across server restarts
- Can login and access patient dashboard
- Can book appointments with doctors

## 🎯 What Patients Can Do

Once logged in, patients can:
- ✅ View personalized wellness dashboard
- ✅ Track health metrics (steps, water, sleep, activity)
- ✅ Book appointments with doctors
- ✅ View preventive care reminders
- ✅ Manage their profile
- ✅ Set wellness goals
- ✅ View messages from doctors

## 🗄️ View in Database

```bash
# View all patients
mongosh healthcare --eval "db.users.find({role:'patient'}).pretty()"

# Count patients
mongosh healthcare --eval "db.users.countDocuments({role:'patient'})"
```
