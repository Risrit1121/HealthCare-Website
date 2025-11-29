# Healthcare Database - User Passwords

## 🔐 Password Information

**Note:** Passwords are hashed using bcrypt (salt rounds: 10)

---

## 👨‍⚕️ Doctors (Pre-seeded)

| Name | Email | Password | Hashed Password |
|------|-------|----------|-----------------|
| Dr Rishi Cheekatla | rishi@healthcare.com | `rishi123` | $2a$10$5rJrQWzyvT9JAuqvHRytgOv8lvUn2KeQZi.HTRU8wnnIqH/1CCALm |
| Dr HemaSri | hemasri@healthcare.com | `hema123` | $2a$10$Jm8CQTr3.t8oxFf0wmufMeE5NQxjFVIxamBzGugG5tMVCu0fqDWGy |
| Dr Purvi | purvi@healthcare.com | `purvi123` | $2a$10$C1ELyHMBS9pvXvIgVcROYef5hkvjYyYTSO0ZDm1uRpNUvH1I3HvDO |
| Dr Akshaya | akshaya@healthcare.com | `akshaya123` | $2a$10$.r6PPgIzJVjEzDcERGnklebgT6pzUoBCvkysJvnJUmMGgbSrAz6Cy |

---

## 👥 Patients (Seeded)

| Name | Email | Password (Hashed) |
|------|-------|-------------------|
| John Smith | john.smith@email.com | $2a$10$gpONv7YSub.zBMEFUBTPKuVrc.jfNy6yp6oHS5T4.sOdc40gflCty |
| Sarah Johnson | sarah.j@email.com | $2a$10$gUynzzH7Cou/pOdX7RmATerTFyTIWPx0kT9.fVdGnCsMj8xBGy9I6 |
| Michael Brown | michael.b@email.com | $2a$10$Uq4KZIqPvRpe9yDt5/Z10uQkTblHWg8Fv41lnVNwdZKaU59B7Fw8y |
| Emily Davis | emily.d@email.com | $2a$10$.wNQ6fgbfPNixKTiti/S0exR1nWmU9MenM.xxwZjIib8jX0oebiQK |
| David Wilson | david.w@email.com | $2a$10$0jv31tbOlFg7RgOg/rgs.OtZvUrFx/UNPX6MFUNDLKxRLWtGu4HNW |
| Jessica Martinez | jessica.m@email.com | $2a$10$h5IhIF54AK/s7BI0.MYEue5WgcR0ZB1DqcnIKWxB0X/OsM0lHB6g. |
| Robert Taylor | robert.t@email.com | $2a$10$WIq/pl2oTqz8MVsqwt44g.fuTnz.LfZSNdoJvnyuSc8DqeB0mkiVO |
| Lisa Anderson | lisa.a@email.com | $2a$10$KXeegg0RPGy4AyC9OBib8ukXP4fQfiiFMkWZUKFHSZr9qW9k8avwe |
| James Thomas | james.t@email.com | $2a$10$S683JMlS5G3VkDti6E9u0.XWFbKzRyA3syLbbwJWJxU9nZn576brC |
| Maria Garcia | maria.g@email.com | $2a$10$L05HA9lG3PuYEMzzVsi0q.jCucC/6.DoOaDmUXEDuT1AWfKnxb.A. |

---

## 📋 MongoDB Queries

### View all users with passwords:
```javascript
use healthcare
db.users.find({}, { name: 1, email: 1, password: 1, role: 1 })
```

### View only doctors:
```javascript
db.users.find({ role: "provider" }, { name: 1, email: 1, password: 1 })
```

### View only patients:
```javascript
db.users.find({ role: "patient" }, { name: 1, email: 1, password: 1 })
```

### Check specific user:
```javascript
db.users.findOne({ email: "rishi@healthcare.com" })
```

### Count users by role:
```javascript
db.users.countDocuments({ role: "provider" })  // Doctors
db.users.countDocuments({ role: "patient" })   // Patients
```

---

## 🔧 Quick Commands

### Connect to MongoDB:
```bash
mongosh healthcare
```

### Export all users:
```bash
mongosh healthcare --quiet --eval "db.users.find().forEach(printjson)"
```

### View passwords in terminal:
```bash
mongosh healthcare --quiet --eval "db.users.find({}, { name: 1, email: 1, password: 1, role: 1 }).forEach(u => print(JSON.stringify(u, null, 2)))"
```

---

## 📊 Summary

- **Total Doctors:** 4
- **Total Patients:** 10
- **Total Users:** 14
- **Password Hashing:** bcrypt with 10 salt rounds
- **Database:** healthcare
- **Collection:** users
