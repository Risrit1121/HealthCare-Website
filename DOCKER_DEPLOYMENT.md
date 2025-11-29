# 🐳 Docker Deployment Guide

## Prerequisites
- Docker installed
- Docker Compose installed

## Quick Start

### 1. Build and Start All Services
```bash
cd /Users/rishicheekatla/Coding/HealthCare
docker-compose up --build
```

### 2. Start in Background (Detached Mode)
```bash
docker-compose up -d
```

### 3. Stop All Services
```bash
docker-compose down
```

### 4. Stop and Remove Volumes (Clean Start)
```bash
docker-compose down -v
```

## Services

### MongoDB
- **Container:** healthcare-mongodb
- **Port:** 27017
- **Database:** healthcare
- **Volume:** mongodb_data (persistent)

### Backend API
- **Container:** healthcare-backend
- **Port:** 3000
- **URL:** http://localhost:3000
- **Environment:**
  - MongoDB: mongodb://mongodb:27017/healthcare
  - JWT Secret: Configured in docker-compose.yml

### Frontend (React)
- **Container:** healthcare-frontend
- **Port:** 3001
- **URL:** http://localhost:3001
- **API:** http://localhost:3000

## Access Application

Once running:
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **MongoDB:** localhost:27017

## Docker Commands

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Follow logs
docker-compose logs -f
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Execute Commands in Container
```bash
# Backend shell
docker exec -it healthcare-backend sh

# MongoDB shell
docker exec -it healthcare-mongodb mongosh healthcare
```

### Seed Data
```bash
# Seed patients
docker exec -it healthcare-backend node seedPatients.js
```

## Production Deployment

### 1. Update Environment Variables
Edit `docker-compose.yml`:
```yaml
environment:
  - JWT_SECRET=your_production_secret_here
  - MONGODB_URI=mongodb://mongodb:27017/healthcare
```

### 2. Build for Production
```bash
docker-compose -f docker-compose.yml up --build -d
```

### 3. Use Production MongoDB
For production, use MongoDB Atlas or external MongoDB:
```yaml
environment:
  - MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/healthcare
```

## Troubleshooting

### Port Already in Use
```bash
# Stop local services
pkill -f "node.*server.js"
brew services stop mongodb-community

# Or change ports in docker-compose.yml
```

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Rebuild
docker-compose up --build
```

### Database Issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

### Frontend Not Loading
```bash
# Check if backend is running
curl http://localhost:3000/api/doctors

# Restart frontend
docker-compose restart frontend
```

## File Structure
```
HealthCare/
├── docker-compose.yml       # Main orchestration
├── Backend/
│   ├── Dockerfile           # Backend image
│   ├── .dockerignore
│   └── ...
├── Frontend/
│   ├── Dockerfile           # Frontend image
│   ├── .dockerignore
│   └── ...
└── DOCKER_DEPLOYMENT.md     # This file
```

## Environment Variables

### Backend (.env)
```env
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/healthcare
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:3000
```

## Data Persistence

MongoDB data is stored in Docker volume `mongodb_data`:
- Survives container restarts
- Removed with `docker-compose down -v`
- Backup: `docker run --rm -v mongodb_data:/data -v $(pwd):/backup mongo tar czf /backup/mongodb-backup.tar.gz /data`

## Health Checks

### Check Backend
```bash
curl http://localhost:3000/api/doctors
```

### Check Frontend
```bash
curl http://localhost:3001
```

### Check MongoDB
```bash
docker exec -it healthcare-mongodb mongosh healthcare --eval "db.users.countDocuments()"
```

## Scaling

### Run Multiple Backend Instances
```bash
docker-compose up --scale backend=3
```

### Load Balancer (Nginx)
Add nginx service to docker-compose.yml for load balancing.

## Security Notes

⚠️ **Important for Production:**
1. Change JWT_SECRET
2. Use environment-specific .env files
3. Enable MongoDB authentication
4. Use HTTPS
5. Set up firewall rules
6. Regular backups

## Quick Commands Reference

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Restart
docker-compose restart

# Clean restart
docker-compose down -v && docker-compose up --build -d

# Shell access
docker exec -it healthcare-backend sh
```

## Success!

If everything is running:
- ✅ MongoDB on port 27017
- ✅ Backend API on port 3000
- ✅ Frontend on port 3001

Visit: **http://localhost:3001** 🎉
