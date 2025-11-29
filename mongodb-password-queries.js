// MongoDB Queries to Check Passwords in Healthcare Database

// Connect to MongoDB
use healthcare

// 1. View all users with their emails and passwords (hashed)
db.users.find({}, { name: 1, email: 1, password: 1, role: 1, _id: 0 })

// 2. View all users in a readable format
db.users.find().pretty()

// 3. Check specific user password
db.users.findOne({ email: "rishi@healthcare.com" }, { name: 1, email: 1, password: 1 })

// 4. View all doctors with passwords
db.users.find({ role: "provider" }, { name: 1, email: 1, password: 1 })

// 5. View all patients with passwords
db.users.find({ role: "patient" }, { name: 1, email: 1, password: 1 })

// 6. Count total users
db.users.countDocuments()

// 7. List all user emails and roles
db.users.find({}, { email: 1, role: 1, _id: 0 })
