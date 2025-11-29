# 🚀 AWS Deployment Guide

## Prerequisites
- AWS Account
- AWS CLI installed
- Docker installed locally

## Step 1: Install AWS CLI

```bash
# Install AWS CLI
brew install awscli

# Verify installation
aws --version
```

## Step 2: Configure AWS Credentials

```bash
# Configure AWS
aws configure

# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format: json
```

## Step 3: Create ECR Repositories

```bash
# Create repository for backend
aws ecr create-repository --repository-name healthcare-backend --region us-east-1

# Create repository for frontend
aws ecr create-repository --repository-name healthcare-frontend --region us-east-1
```

## Step 4: Build and Push Docker Images

### Login to ECR
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

### Build and Push Backend
```bash
cd Backend

# Build
docker build -t healthcare-backend .

# Tag
docker tag healthcare-backend:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/healthcare-backend:latest

# Push
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/healthcare-backend:latest
```

### Build and Push Frontend
```bash
cd ../Frontend

# Build
docker build -t healthcare-frontend .

# Tag
docker tag healthcare-frontend:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/healthcare-frontend:latest

# Push
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/healthcare-frontend:latest
```

## Step 5: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (allow all)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/healthcare`

## Step 6: Deploy with AWS ECS (Elastic Container Service)

### Create ECS Cluster
```bash
aws ecs create-cluster --cluster-name healthcare-cluster --region us-east-1
```

### Create Task Definition

Create `task-definition.json`:
```json
{
  "family": "healthcare-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/healthcare-backend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "MONGODB_URI",
          "value": "YOUR_MONGODB_ATLAS_URI"
        },
        {
          "name": "JWT_SECRET",
          "value": "your_production_secret"
        },
        {
          "name": "JWT_EXPIRES_IN",
          "value": "24h"
        }
      ]
    },
    {
      "name": "frontend",
      "image": "YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/healthcare-frontend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "REACT_APP_API_URL",
          "value": "http://YOUR_BACKEND_URL:3000"
        }
      ]
    }
  ]
}
```

### Register Task Definition
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### Create Service
```bash
aws ecs create-service \
  --cluster healthcare-cluster \
  --service-name healthcare-service \
  --task-definition healthcare-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}"
```

## Step 7: Setup Load Balancer (Optional)

```bash
# Create Application Load Balancer
aws elbv2 create-load-balancer \
  --name healthcare-lb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx
```

## Alternative: Deploy with AWS Elastic Beanstalk

### Install EB CLI
```bash
pip install awsebcli
```

### Initialize and Deploy
```bash
cd /Users/rishicheekatla/Coding/HealthCare

# Initialize
eb init -p docker healthcare-app --region us-east-1

# Create environment
eb create healthcare-env

# Deploy
eb deploy

# Open in browser
eb open
```

## Alternative: Deploy with AWS App Runner (Easiest)

### Using AWS Console:
1. Go to AWS App Runner
2. Click "Create service"
3. Select "Container registry" → ECR
4. Choose your image
5. Configure:
   - Port: 3000
   - Environment variables
6. Click "Create & deploy"

### Using CLI:
```bash
aws apprunner create-service \
  --service-name healthcare-backend \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/healthcare-backend:latest",
      "ImageRepositoryType": "ECR"
    }
  }'
```

## Step 8: Get Your Application URL

```bash
# Get service details
aws ecs describe-services --cluster healthcare-cluster --services healthcare-service

# Or for App Runner
aws apprunner list-services
```

## Environment Variables for Production

### Backend
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/healthcare
JWT_SECRET=change_this_to_strong_secret
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=production
```

### Frontend
```
REACT_APP_API_URL=https://your-backend-url.amazonaws.com
```

## Cost Estimate (AWS Free Tier)

- **ECS Fargate:** ~$15-30/month
- **App Runner:** ~$5-15/month (cheaper)
- **MongoDB Atlas:** Free (M0 cluster)
- **ECR:** Free (500MB storage)

## Quick Deploy Script

Create `deploy-aws.sh`:
```bash
#!/bin/bash

# Build images
docker-compose build

# Tag and push
docker tag healthcare-backend YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/healthcare-backend:latest
docker tag healthcare-frontend YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/healthcare-frontend:latest

docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/healthcare-backend:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/healthcare-frontend:latest

# Update ECS service
aws ecs update-service --cluster healthcare-cluster --service healthcare-service --force-new-deployment
```

## Monitoring

```bash
# View logs
aws logs tail /ecs/healthcare-task --follow

# Check service status
aws ecs describe-services --cluster healthcare-cluster --services healthcare-service
```

## Cleanup (To avoid charges)

```bash
# Delete service
aws ecs delete-service --cluster healthcare-cluster --service healthcare-service --force

# Delete cluster
aws ecs delete-cluster --cluster healthcare-cluster

# Delete ECR repositories
aws ecr delete-repository --repository-name healthcare-backend --force
aws ecr delete-repository --repository-name healthcare-frontend --force
```

## Recommended: Use AWS App Runner (Simplest)

**Pros:**
- Easiest to deploy
- Auto-scaling
- Cheaper than ECS
- Built-in load balancing
- HTTPS included

**Steps:**
1. Push images to ECR (Steps 3-4 above)
2. Go to AWS App Runner console
3. Create service from ECR image
4. Done! Get public URL

## Support

- AWS Documentation: https://docs.aws.amazon.com
- AWS Free Tier: https://aws.amazon.com/free
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

---

**Your healthcare application will be live on AWS!** 🚀
