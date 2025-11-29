#!/bin/bash

echo "🚀 AWS Deployment Script for HealthCare Application"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Installing..."
    brew install awscli
fi

# Check AWS configuration
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS not configured. Please run: aws configure"
    exit 1
fi

echo "✅ AWS CLI configured"
echo ""

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION="us-east-1"

echo "📋 AWS Account ID: $AWS_ACCOUNT_ID"
echo "📍 Region: $AWS_REGION"
echo ""

# Create ECR repositories if they don't exist
echo "📦 Creating ECR repositories..."
aws ecr describe-repositories --repository-names healthcare-backend --region $AWS_REGION 2>/dev/null || \
  aws ecr create-repository --repository-name healthcare-backend --region $AWS_REGION

aws ecr describe-repositories --repository-names healthcare-frontend --region $AWS_REGION 2>/dev/null || \
  aws ecr create-repository --repository-name healthcare-frontend --region $AWS_REGION

echo "✅ ECR repositories ready"
echo ""

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "✅ Logged in to ECR"
echo ""

# Build and push backend
echo "🏗️  Building backend..."
cd Backend
docker build -t healthcare-backend .
docker tag healthcare-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/healthcare-backend:latest

echo "⬆️  Pushing backend to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/healthcare-backend:latest

echo "✅ Backend deployed to ECR"
echo ""

# Build and push frontend
echo "🏗️  Building frontend..."
cd ../Frontend
docker build -t healthcare-frontend .
docker tag healthcare-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/healthcare-frontend:latest

echo "⬆️  Pushing frontend to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/healthcare-frontend:latest

echo "✅ Frontend deployed to ECR"
echo ""

cd ..

echo "🎉 Deployment Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Setup MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
echo "2. Go to AWS App Runner: https://console.aws.amazon.com/apprunner"
echo "3. Create service from ECR image"
echo "4. Add environment variables"
echo ""
echo "📦 Your images:"
echo "Backend:  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/healthcare-backend:latest"
echo "Frontend: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/healthcare-frontend:latest"
