#!/bin/bash

# Check if the variable is provided
if [ -z "$1" ]; then
  echo "Please provide a string variable "qa" or "prod"."
  exit 1
fi

# Store the variable in a separate variable
environment=$(echo "$1" | tr '[:upper:]' '[:lower:]')

# Use the variable in your script logic
echo "Deploying to $environment environment..."

# Additional script logic based on the provided variable
if [ "$environment" = "qa" ]; then
  # Perform actions for the QA environment
  echo "Performing QA deployment steps..."
elif [ "$environment" = "prod" ]; then
  # Perform actions for the production environment
  echo "Performing production deployment steps..."
else
  # Handle unrecognized environments
  echo "Unrecognized environment: $environment"
  exit 1
fi

APP_NAME=$(grep 'app_name:' ./atmos/config/atmos/environments/$environment.yml)
NAME=${APP_NAME:10}

zip -r  -q $NAME.zip . -x "/atmos/*" "/.git/*" "/.env"
echo "Zip complete"
echo "Sending $NAME.zip to AWS S3 bucket"
aws s3 cp $NAME.zip s3://pse-lambda-code-$environment/$NAME.zip --profile $environment
echo "Zip pushed to AWS S3 bucket"
echo "Running atmos -e $environment apply"
cd atmos
atmos -e $environment apply
echo "Connecting Lambda to $NAME.zip"
RESULT=$(aws lambda update-function-code --function-name pse-$NAME-lambda-$environment --profile $environment --region us-east-1 --s3-bucket pse-lambda-code-$environment --s3-key $NAME.zip)
echo "Lambda code updated"
cd ..
rm $NAME.zip