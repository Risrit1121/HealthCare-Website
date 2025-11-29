#!/bin/bash

echo "Waiting for backend service to be ready..."

while true; do
  STATUS=$(aws apprunner describe-service \
    --service-arn arn:aws:apprunner:us-east-1:685057748064:service/healthcare-backend/20f018b0c75341d4b224fb368d50ad53 \
    --region us-east-1 \
    --query 'Service.Status' \
    --output text)
  
  echo "Current status: $STATUS"
  
  if [ "$STATUS" = "RUNNING" ]; then
    echo "✅ Backend is ready! Updating MongoDB URI..."
    
    aws apprunner update-service \
      --service-arn arn:aws:apprunner:us-east-1:685057748064:service/healthcare-backend/20f018b0c75341d4b224fb368d50ad53 \
      --region us-east-1 \
      --source-configuration '{
        "AuthenticationConfiguration": {
          "AccessRoleArn": "arn:aws:iam::685057748064:role/AppRunnerECRAccessRole"
        },
        "ImageRepository": {
          "ImageIdentifier": "685057748064.dkr.ecr.us-east-1.amazonaws.com/healthcare-backend:latest",
          "ImageConfiguration": {
            "RuntimeEnvironmentVariables": {
              "MONGODB_URI": "mongodb+srv://es22btech11009_db_user:vTQSJuOHSfuY06Ww@cluster0.1pu4piu.mongodb.net/healthcare",
              "JWT_EXPIRES_IN": "30d",
              "PORT": "3000",
              "JWT_SECRET": "your_super_secret_jwt_key_change_this_in_production"
            },
            "Port": "3000"
          },
          "ImageRepositoryType": "ECR"
        }
      }'
    
    echo "✅ MongoDB URI updated!"
    break
  fi
  
  sleep 15
done
