# 🏥 HealthCare+ Website

A beautiful, secure healthcare website built with React, Node.js, and MongoDB featuring JWT authentication, role-based access, and wellness tracking.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based login/registration with bcrypt password hashing
- 👥 **Role-Based Access** - Separate portals for Patients and Healthcare Providers
- 📊 **Patient Dashboard** - Wellness tracking, health tips, and activity monitoring
- 📅 **Appointment Booking** - Easy online appointment scheduling
- 💬 **Messaging System** - Communication between patients and doctors
- 🎯 **Wellness Goals** - Track steps, active time, water intake, and sleep
- 💊 **Preventive Care** - Automated health reminders
- ⚛️ **Modern UI** - Beautiful gradient design with smooth animations
- 🗄️ **MongoDB Database** - Persistent storage for users and appointments

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
cd /Users/rishicheekatla/Coding/HealthCare
docker-compose up --build
```
- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- MongoDB: Automatically configured

### Option 2: Manual Setup

#### 1. Start MongoDB
```bash
brew services start mongodb/brew/mongodb-community
```

#### 2. Start Backend
```bash
cd Backend
npm start
```
Backend runs on **http://localhost:3000**

#### 3. Start Frontend
```bash
cd Frontend
npm start
```
Frontend runs on **http://localhost:3001** (opens automatically)

## 👨‍⚕️ Pre-configured Doctors

| Name | Email | Password |
|------|-------|----------|
| Dr Rishi Cheekatla | rishi@healthcare.com | rishi123 |
| Dr HemaSri | hemasri@healthcare.com | hema123 |
| Dr Purvi | purvi@healthcare.com | purvi123 |
| Dr Akshaya | akshaya@healthcare.com | akshaya123 |

## 👥 Dummy Patients (for testing)

| Name | Email | Password |
|------|-------|----------|
| John Smith | john.smith@email.com | patient123 |
| Sarah Johnson | sarah.j@email.com | patient123 |
| Michael Brown | michael.b@email.com | patient123 |
| Emily Davis | emily.d@email.com | patient123 |
| David Wilson | david.w@email.com | patient123 |
| + 5 more... | (see PATIENTS.md) | patient123 |

### Login as Doctor:
1. Select **Healthcare Provider** role
2. Use any doctor's email and password above
3. Access provider dashboard with all appointments

### Login as Patient:
1. Select **Patient** role
2. Use any patient email above with password: `patient123`
3. Access personalized wellness dashboard

### Register New Patient:
1. Select **Patient** role
2. Click "Create Account"
3. Enter your details (password min 6 chars)
4. Access personalized wellness dashboard

## 🎨 Beautiful Design Features

### Login Page
- ✨ Animated gradient background with floating elements
- 🎭 Smooth role selector with hover effects
- 💫 Glassmorphism info cards
- 🌊 Ripple effect on buttons
- 📱 Fully responsive design

### Patient Dashboard
- 📊 Real-time wellness statistics
- 🎯 Progress bars for health goals
- 💡 Daily health tips
- 🔔 Preventive care reminders
- 👤 Profile management
- 💬 Doctor messaging

### Home Page
- 🏥 Service showcase
- 📅 Appointment booking form
- 📞 Contact information
- 🎨 Modern card-based layout

## 🔒 Security Features

- ✅ **Password Hashing** - bcrypt with 10 salt rounds
- ✅ **JWT Tokens** - 24-hour expiration
- ✅ **Protected Routes** - Middleware authentication
- ✅ **Role-Based Authorization** - Patient/Provider separation
- ✅ **Secure Sessions** - Token verification on each request
- ✅ **Environment Variables** - Secrets in .env file
- ✅ **CORS Enabled** - Cross-origin resource sharing
- ✅ **Input Validation** - Server-side validation

## 📁 Project Structure

```
HealthCare/
├── Backend/
│   ├── models/
│   │   ├── User.js           # User schema (patients & doctors)
│   │   └── Appointment.js    # Appointment schema
│   ├── middleware/
│   │   └── auth.js           # JWT verification
│   ├── server.js             # Express API with MongoDB
│   ├── package.json
│   └── .env                  # JWT secret & MongoDB URI
│
└── Frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js      # Beautiful login with animations
    │   │   ├── Login.css     # Gradient design & animations
    │   │   ├── Dashboard.js  # Patient wellness dashboard
    │   │   ├── Dashboard.css
    │   │   ├── Home.js       # Public home page
    │   │   └── Home.css
    │   ├── App.js            # React Router setup
    │   └── index.js
    └── package.json
```

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **React Router** 6.20.1 - Navigation
- **Axios** 1.6.2 - HTTP client
- **CSS3** - Animations & gradients

### Backend
- **Node.js** - Runtime
- **Express** 4.21.2 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** 9.0.2 - Authentication
- **bcryptjs** 2.4.3 - Password hashing
- **dotenv** 16.3.1 - Environment variables

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Appointments (Protected)
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get user appointments
- `GET /api/appointments/:id` - Get specific appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Doctors
- `GET /api/doctors` - Get all healthcare providers

## ⚙️ Environment Setup

Create `.env` in Backend directory:
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h
PORT=3000
MONGODB_URI=mongodb://localhost:27017/healthcare
```

⚠️ **IMPORTANT**: Change `JWT_SECRET` in production!

## 💾 Database

**MongoDB Collections:**
- `users` - Stores patients and healthcare providers
- `appointments` - Stores appointment bookings

**Auto-seeded Doctors:**
- 4 doctors are automatically created on first run
- Stored in MongoDB with hashed passwords
- Persistent across server restarts

## 🎯 User Flows

### Patient Flow
1. Register/Login as Patient
2. View personalized dashboard
3. Track wellness metrics
4. Book appointments
5. View preventive care reminders
6. Message with doctors

### Provider Flow
1. Login as Healthcare Provider
2. View all patient appointments
3. Access patient information
4. Manage appointment requests
5. View dashboard analytics

## 🌟 Design Highlights

- **Gradient Backgrounds** - Purple to pink gradients
- **Smooth Animations** - Slide, fade, float effects
- **Glassmorphism** - Frosted glass effect on cards
- **Hover Effects** - Interactive button states
- **Progress Bars** - Visual health goal tracking
- **Responsive Layout** - Mobile-first design
- **Modern Typography** - Clean, readable fonts
- **Color Palette** - Professional healthcare theme

## 📱 Responsive Design

- Desktop: Full two-column layout
- Tablet: Adaptive grid system
- Mobile: Single column, touch-friendly

## 🚦 Getting Started (First Time)

```bash
# Clone or navigate to project
cd /Users/rishicheekatla/Coding/HealthCare

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install

# Start backend (Terminal 1)
cd Backend
npm start

# Start frontend (Terminal 2)
cd Frontend
npm start
```

## 🎓 Test Accounts

**Try logging in as:**
- Dr Rishi Cheekatla (Provider)
- Create your own patient account

## 📝 Notes

- Backend auto-seeds 4 doctors on startup
- JWT tokens expire after 24 hours
- Passwords are hashed and never stored in plain text
- All API routes (except auth) require valid JWT token
- Patients see only their appointments
- Providers see all appointments

## 🔮 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real-time chat with Socket.io
- [ ] Email notifications
- [ ] Payment integration
- [ ] Medical records upload
- [ ] Video consultations
- [ ] Prescription management
- [ ] Lab results portal

---

**Built with ❤️ for better healthcare access**

🌐 **Live URLs:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
